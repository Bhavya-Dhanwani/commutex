import { eq, and, ne } from "drizzle-orm";

import db from "../../db/index.js";
import { trips } from "../../db/schemas/trip.js";
import { vehicles } from "../../db/schemas/vehicle.js";
import { drivers } from "../../db/schemas/driver.js";

import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export async function getTrips(req, res) {
    const list = await db.select().from(trips);

    return ApiResponse.ok(res, "Trips fetched successfully", { trips: list });
}

export async function getTripById(req, res) {
    const { id } = req.params;

    const [trip] = await db.select().from(trips).where(eq(trips.id, id));

    if (!trip) {
        throw ApiError.notFound("Trip not found");
    }

    return ApiResponse.ok(res, "Trip fetched successfully", { trip });
}

export async function createTrip(req, res) {
    const {
        tripNumber,
        vehicleId,
        driverId,
        source,
        destination,
        cargoWeight,
        plannedDistance,
        expectedArrival,
        remarks,
    } = req.validatedData;

    const [existingTrip] = await db
        .select()
        .from(trips)
        .where(eq(trips.tripNumber, tripNumber));

    if (existingTrip) {
        throw ApiError.conflict("Trip with this trip number already exists");
    }

    const [vehicle] = await db
        .select()
        .from(vehicles)
        .where(eq(vehicles.id, vehicleId));

    if (!vehicle) {
        throw ApiError.notFound("Vehicle not found");
    }

    if (vehicle.status !== "Available") {
        throw ApiError.badRequest(
            `Vehicle is not available (status: ${vehicle.status})`,
        );
    }

    const [driver] = await db
        .select()
        .from(drivers)
        .where(eq(drivers.id, driverId));

    if (!driver) {
        throw ApiError.notFound("Driver not found");
    }

    if (driver.status !== "Available") {
        throw ApiError.badRequest(
            `Driver is not available (status: ${driver.status})`,
        );
    }

    if (cargoWeight !== undefined && cargoWeight > vehicle.maxLoadCapacity) {
        throw ApiError.badRequest(
            `Cargo weight (${cargoWeight} kg) exceeds vehicle max load capacity (${vehicle.maxLoadCapacity} kg)`,
        );
    }

    const parsedExpectedArrival = expectedArrival
        ? new Date(expectedArrival)
        : null;

    const [trip] = await db
        .insert(trips)
        .values({
            tripNumber,
            vehicleId,
            driverId,
            source,
            destination,
            cargoWeight,
            plannedDistance,
            expectedArrival: parsedExpectedArrival,
            status: "Draft",
            createdBy: req.user.id,
            remarks,
        })
        .returning();

    return ApiResponse.created(res, "Trip created successfully", { trip });
}

export async function updateTrip(req, res) {
    const { id } = req.params;
    const updateData = req.validatedData;

    const [trip] = await db.select().from(trips).where(eq(trips.id, id));

    if (!trip) {
        throw ApiError.notFound("Trip not found");
    }

    if (trip.status === "Completed" || trip.status === "Cancelled") {
        throw ApiError.badRequest(`Cannot edit a trip that is ${trip.status}`);
    }

    if (updateData.tripNumber) {
        const [existingTrip] = await db
            .select()
            .from(trips)
            .where(
                and(
                    eq(trips.tripNumber, updateData.tripNumber),
                    ne(trips.id, id),
                ),
            );

        if (existingTrip) {
            throw ApiError.conflict("Trip number already in use");
        }
    }

    let targetVehicleId = updateData.vehicleId || trip.vehicleId;
    let targetCargoWeight =
        updateData.cargoWeight !== undefined
            ? updateData.cargoWeight
            : trip.cargoWeight;

    let vehicle;
    if (updateData.vehicleId && updateData.vehicleId !== trip.vehicleId) {
        const [v] = await db
            .select()
            .from(vehicles)
            .where(eq(vehicles.id, updateData.vehicleId));

        if (!v) {
            throw ApiError.notFound("New vehicle not found");
        }

        if (v.status !== "Available") {
            throw ApiError.badRequest(
                `New vehicle is not available (status: ${v.status})`,
            );
        }
        vehicle = v;
    } else {
        const [v] = await db
            .select()
            .from(vehicles)
            .where(eq(vehicles.id, targetVehicleId));
        vehicle = v;
    }

    if (updateData.driverId && updateData.driverId !== trip.driverId) {
        const [d] = await db
            .select()
            .from(drivers)
            .where(eq(drivers.id, updateData.driverId));

        if (!d) {
            throw ApiError.notFound("New driver not found");
        }

        if (d.status !== "Available") {
            throw ApiError.badRequest(
                `New driver is not available (status: ${d.status})`,
            );
        }
    }

    if (
        vehicle &&
        targetCargoWeight !== null &&
        targetCargoWeight !== undefined
    ) {
        if (targetCargoWeight > vehicle.maxLoadCapacity) {
            throw ApiError.badRequest(
                `Cargo weight (${targetCargoWeight} kg) exceeds vehicle max load capacity (${vehicle.maxLoadCapacity} kg)`,
            );
        }
    }

    const parsedData = { ...updateData };
    if (updateData.expectedArrival) {
        parsedData.expectedArrival = new Date(updateData.expectedArrival);
    }

    const [updatedTrip] = await db
        .update(trips)
        .set({
            ...parsedData,
            updatedAt: new Date(),
        })
        .where(eq(trips.id, id))
        .returning();

    return ApiResponse.ok(res, "Trip updated successfully", {
        trip: updatedTrip,
    });
}

export async function dispatchTrip(req, res) {
    const { id } = req.params;

    const [trip] = await db.select().from(trips).where(eq(trips.id, id));

    if (!trip) {
        throw ApiError.notFound("Trip not found");
    }

    if (trip.status !== "Draft") {
        throw ApiError.badRequest(
            `Only Draft trips can be dispatched (current status: ${trip.status})`,
        );
    }

    const [vehicle] = await db
        .select()
        .from(vehicles)
        .where(eq(vehicles.id, trip.vehicleId));

    if (!vehicle) {
        throw ApiError.notFound("Vehicle associated with the trip not found");
    }

    if (vehicle.status !== "Available") {
        throw ApiError.badRequest(
            `Vehicle is not available (current status: ${vehicle.status})`,
        );
    }

    const [driver] = await db
        .select()
        .from(drivers)
        .where(eq(drivers.id, trip.driverId));

    if (!driver) {
        throw ApiError.notFound("Driver associated with the trip not found");
    }

    if (driver.status !== "Available") {
        throw ApiError.badRequest(
            `Driver is not available (current status: ${driver.status})`,
        );
    }

    let updatedTrip;

    await db.transaction(async (tx) => {
        // Update Trip
        [updatedTrip] = await tx
            .update(trips)
            .set({
                status: "Dispatched",
                dispatchDate: new Date(),
                startOdometer: vehicle.odometer,
                updatedAt: new Date(),
            })
            .where(eq(trips.id, id))
            .returning();

        // Lock Vehicle
        await tx
            .update(vehicles)
            .set({
                status: "On Trip",
                updatedAt: new Date(),
            })
            .where(eq(vehicles.id, trip.vehicleId));

        // Lock Driver
        await tx
            .update(drivers)
            .set({
                status: "On Trip",
                updatedAt: new Date(),
            })
            .where(eq(drivers.id, trip.driverId));
    });

    return ApiResponse.ok(res, "Trip dispatched successfully", {
        trip: updatedTrip,
    });
}

export async function completeTrip(req, res) {
    const { id } = req.params;
    const { endOdometer, actualDistance, fuelConsumed, revenue } =
        req.validatedData;

    const [trip] = await db.select().from(trips).where(eq(trips.id, id));

    if (!trip) {
        throw ApiError.notFound("Trip not found");
    }

    if (trip.status !== "Dispatched") {
        throw ApiError.badRequest(
            `Only Dispatched trips can be completed (current status: ${trip.status})`,
        );
    }

    const startOdometer = trip.startOdometer || 0;
    if (endOdometer < startOdometer) {
        throw ApiError.badRequest(
            `End odometer (${endOdometer}) cannot be less than start odometer (${startOdometer})`,
        );
    }

    let updatedTrip;

    await db.transaction(async (tx) => {
        // Update Trip
        [updatedTrip] = await tx
            .update(trips)
            .set({
                status: "Completed",
                completedDate: new Date(),
                endOdometer,
                actualDistance: actualDistance || endOdometer - startOdometer,
                fuelConsumed,
                revenue,
                updatedAt: new Date(),
            })
            .where(eq(trips.id, id))
            .returning();

        // Release Vehicle and set odometer to endOdometer
        await tx
            .update(vehicles)
            .set({
                status: "Available",
                odometer: endOdometer,
                updatedAt: new Date(),
            })
            .where(eq(vehicles.id, trip.vehicleId));

        // Release Driver
        await tx
            .update(drivers)
            .set({
                status: "Available",
                updatedAt: new Date(),
            })
            .where(eq(drivers.id, trip.driverId));
    });

    return ApiResponse.ok(res, "Trip completed successfully", {
        trip: updatedTrip,
    });
}

export async function cancelTrip(req, res) {
    const { id } = req.params;

    const [trip] = await db.select().from(trips).where(eq(trips.id, id));

    if (!trip) {
        throw ApiError.notFound("Trip not found");
    }

    if (trip.status === "Completed" || trip.status === "Cancelled") {
        throw ApiError.badRequest(
            `Cannot cancel a trip that is already ${trip.status}`,
        );
    }

    let updatedTrip;

    await db.transaction(async (tx) => {
        // Cancel Trip
        [updatedTrip] = await tx
            .update(trips)
            .set({
                status: "Cancelled",
                updatedAt: new Date(),
            })
            .where(eq(trips.id, id))
            .returning();

        // Restore vehicle/driver availability if dispatched
        if (trip.status === "Dispatched") {
            await tx
                .update(vehicles)
                .set({
                    status: "Available",
                    updatedAt: new Date(),
                })
                .where(eq(vehicles.id, trip.vehicleId));

            await tx
                .update(drivers)
                .set({
                    status: "Available",
                    updatedAt: new Date(),
                })
                .where(eq(drivers.id, trip.driverId));
        }
    });

    return ApiResponse.ok(res, "Trip cancelled successfully", {
        trip: updatedTrip,
    });
}
