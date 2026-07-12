import { eq, and, ne, or, ilike } from "drizzle-orm";

import db from "../../db/index.js";
import { vehicles } from "../../db/schemas/vehicle.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export async function getVehicles(req, res) {
    const { search } = req.query;

    let query = db.select().from(vehicles);

    if (search) {
        query = query.where(
            or(
                ilike(vehicles.registrationNumber, `%${search}%`),
                ilike(vehicles.model, `%${search}%`),
                ilike(vehicles.region, `%${search}%`),
                ilike(vehicles.notes, `%${search}%`)
            )
        );
    }

    const list = await query;

    return ApiResponse.ok(res, "Vehicles fetched successfully", {
        vehicles: list,
    });
}

export async function getVehicleById(req, res) {
    const { id } = req.params;

    const [vehicle] = await db
        .select()
        .from(vehicles)
        .where(eq(vehicles.id, id));

    if (!vehicle) {
        throw ApiError.notFound("Vehicle not found");
    }

    return ApiResponse.ok(res, "Vehicle fetched successfully", { vehicle });
}

export async function createVehicle(req, res) {
    const {
        registrationNumber,
        model,
        type,
        maxLoadCapacity,
        odometer,
        acquisitionCost,
        purchaseDate,
        status,
        region,
        notes,
    } = req.validatedData;

    const [existingVehicle] = await db
        .select()
        .from(vehicles)
        .where(eq(vehicles.registrationNumber, registrationNumber));

    if (existingVehicle) {
        throw ApiError.conflict(
            "Vehicle with this registration number already exists",
        );
    }

    const [vehicle] = await db
        .insert(vehicles)
        .values({
            registrationNumber,
            model,
            type,
            maxLoadCapacity,
            odometer,
            acquisitionCost,
            purchaseDate,
            status,
            region,
            notes,
            createdBy: req.user.id,
        })
        .returning();

    return ApiResponse.created(res, "Vehicle created successfully", {
        vehicle,
    });
}

export async function updateVehicle(req, res) {
    const { id } = req.params;
    const updateData = req.validatedData;

    const [vehicle] = await db
        .select()
        .from(vehicles)
        .where(eq(vehicles.id, id));

    if (!vehicle) {
        throw ApiError.notFound("Vehicle not found");
    }

    // Check unique registrationNumber if changing
    if (updateData.registrationNumber) {
        const [existingVehicle] = await db
            .select()
            .from(vehicles)
            .where(
                and(
                    eq(
                        vehicles.registrationNumber,
                        updateData.registrationNumber,
                    ),
                    ne(vehicles.id, id),
                ),
            );

        if (existingVehicle) {
            throw ApiError.conflict(
                "Vehicle with this registration number already exists",
            );
        }
    }

    const [updatedVehicle] = await db
        .update(vehicles)
        .set({
            ...updateData,
            updatedAt: new Date(),
        })
        .where(eq(vehicles.id, id))
        .returning();

    return ApiResponse.ok(res, "Vehicle updated successfully", {
        vehicle: updatedVehicle,
    });
}
