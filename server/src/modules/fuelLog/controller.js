import { eq } from "drizzle-orm";

import db from "../../db/index.js";
import { fuelLogs } from "../../db/schemas/fuelLog.js";
import { vehicles } from "../../db/schemas/vehicle.js";
import { trips } from "../../db/schemas/trip.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export async function getFuelLogs(req, res) {
    const list = await db
        .select()
        .from(fuelLogs);

    return ApiResponse.ok(res, "Fuel logs fetched successfully", { fuelLogs: list });
}

export async function getFuelLogById(req, res) {
    const { id } = req.params;

    const [log] = await db
        .select()
        .from(fuelLogs)
        .where(eq(fuelLogs.id, id));

    if (!log) {
        throw ApiError.notFound("Fuel log not found");
    }

    return ApiResponse.ok(res, "Fuel log fetched successfully", { fuelLog: log });
}

export async function createFuelLog(req, res) {
    const {
        vehicleId,
        tripId,
        liters,
        cost,
        fuelStation,
        odometer,
        filledOn,
    } = req.validatedData;

    // Verify vehicle exists
    const [vehicle] = await db
        .select()
        .from(vehicles)
        .where(eq(vehicles.id, vehicleId));

    if (!vehicle) {
        throw ApiError.notFound("Vehicle not found");
    }

    // Verify trip exists if provided
    if (tripId) {
        const [trip] = await db
            .select()
            .from(trips)
            .where(eq(trips.id, tripId));

        if (!trip) {
            throw ApiError.notFound("Trip not found");
        }
    }

    const parsedFilledOn = filledOn ? new Date(filledOn) : null;

    const [log] = await db
        .insert(fuelLogs)
        .values({
            vehicleId,
            tripId,
            liters,
            cost,
            fuelStation,
            odometer,
            filledOn: parsedFilledOn,
            createdBy: req.user.id,
        })
        .returning();

    return ApiResponse.created(res, "Fuel log created successfully", { fuelLog: log });
}

export async function updateFuelLog(req, res) {
    const { id } = req.params;
    const updateData = req.validatedData;

    // Check log exists
    const [log] = await db
        .select()
        .from(fuelLogs)
        .where(eq(fuelLogs.id, id));

    if (!log) {
        throw ApiError.notFound("Fuel log not found");
    }

    // Verify vehicle exists if updated
    if (updateData.vehicleId && updateData.vehicleId !== log.vehicleId) {
        const [vehicle] = await db
            .select()
            .from(vehicles)
            .where(eq(vehicles.id, updateData.vehicleId));

        if (!vehicle) {
            throw ApiError.notFound("Vehicle not found");
        }
    }

    // Verify trip exists if updated
    if (updateData.tripId && updateData.tripId !== log.tripId) {
        const [trip] = await db
            .select()
            .from(trips)
            .where(eq(trips.id, updateData.tripId));

        if (!trip) {
            throw ApiError.notFound("Trip not found");
        }
    }

    const parsedData = { ...updateData };
    if (updateData.filledOn) {
        parsedData.filledOn = new Date(updateData.filledOn);
    }

    const [updatedLog] = await db
        .update(fuelLogs)
        .set({
            ...parsedData,
        })
        .where(eq(fuelLogs.id, id))
        .returning();

    return ApiResponse.ok(res, "Fuel log updated successfully", { fuelLog: updatedLog });
}
