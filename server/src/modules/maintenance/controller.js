import { eq } from "drizzle-orm";

import db from "../../db/index.js";
import { maintenanceLogs } from "../../db/schemas/maintenance.js";
import { vehicles } from "../../db/schemas/vehicle.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export async function getMaintenanceLogs(req, res) {
    const list = await db.select().from(maintenanceLogs);

    return ApiResponse.ok(res, "Maintenance logs fetched successfully", {
        maintenanceLogs: list,
    });
}

export async function getMaintenanceLogById(req, res) {
    const { id } = req.params;

    const [log] = await db
        .select()
        .from(maintenanceLogs)
        .where(eq(maintenanceLogs.id, id));

    if (!log) {
        throw ApiError.notFound("Maintenance log not found");
    }

    return ApiResponse.ok(res, "Maintenance log fetched successfully", {
        maintenanceLog: log,
    });
}

export async function createMaintenance(req, res) {
    const { vehicleId, maintenanceType, description, workshop, cost, status } =
        req.validatedData;

    // Verify vehicle exists
    const [vehicle] = await db
        .select()
        .from(vehicles)
        .where(eq(vehicles.id, vehicleId));

    if (!vehicle) {
        throw ApiError.notFound("Vehicle not found");
    }

    const [log] = await db
        .insert(maintenanceLogs)
        .values({
            vehicleId,
            maintenanceType,
            description,
            workshop,
            cost,
            status,
            createdBy: req.user.id,
        })
        .returning();

    return ApiResponse.created(res, "Maintenance log created successfully", {
        maintenanceLog: log,
    });
}

export async function updateMaintenance(req, res) {
    const { id } = req.params;
    const updateData = req.validatedData;

    // Check log exists
    const [log] = await db
        .select()
        .from(maintenanceLogs)
        .where(eq(maintenanceLogs.id, id));

    if (!log) {
        throw ApiError.notFound("Maintenance log not found");
    }

    if (log.status === "Completed") {
        throw ApiError.badRequest("Cannot edit a completed maintenance log");
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

    const [updatedLog] = await db
        .update(maintenanceLogs)
        .set({
            ...updateData,
        })
        .where(eq(maintenanceLogs.id, id))
        .returning();

    return ApiResponse.ok(res, "Maintenance log updated successfully", {
        maintenanceLog: updatedLog,
    });
}

export async function startMaintenance(req, res) {
    const { id } = req.params;

    const [log] = await db
        .select()
        .from(maintenanceLogs)
        .where(eq(maintenanceLogs.id, id));

    if (!log) {
        throw ApiError.notFound("Maintenance log not found");
    }

    if (log.status === "Completed") {
        throw ApiError.badRequest("Cannot start a completed maintenance log");
    }

    const [vehicle] = await db
        .select()
        .from(vehicles)
        .where(eq(vehicles.id, log.vehicleId));

    if (!vehicle) {
        throw ApiError.notFound(
            "Vehicle associated with the maintenance log not found",
        );
    }

    if (vehicle.status !== "Available") {
        throw ApiError.badRequest(
            `Vehicle is not available for maintenance (current status: ${vehicle.status})`,
        );
    }

    let updatedLog;

    await db.transaction(async (tx) => {
        // Update Maintenance log
        [updatedLog] = await tx
            .update(maintenanceLogs)
            .set({
                status: "Active",
                startDate: new Date(),
            })
            .where(eq(maintenanceLogs.id, id))
            .returning();

        // Lock Vehicle to "In Shop"
        await tx
            .update(vehicles)
            .set({
                status: "In Shop",
                updatedAt: new Date(),
            })
            .where(eq(vehicles.id, log.vehicleId));
    });

    return ApiResponse.ok(res, "Maintenance started and vehicle is In Shop", {
        maintenanceLog: updatedLog,
    });
}

export async function completeMaintenance(req, res) {
    const { id } = req.params;
    const { workshop, cost, maintenanceType, description, completedDate } =
        req.validatedData;

    const [log] = await db
        .select()
        .from(maintenanceLogs)
        .where(eq(maintenanceLogs.id, id));

    if (!log) {
        throw ApiError.notFound("Maintenance log not found");
    }

    if (log.status === "Completed") {
        throw ApiError.badRequest("Maintenance is already completed");
    }

    const [vehicle] = await db
        .select()
        .from(vehicles)
        .where(eq(vehicles.id, log.vehicleId));

    if (!vehicle) {
        throw ApiError.notFound(
            "Vehicle associated with the maintenance log not found",
        );
    }

    if (vehicle.status !== "In Shop") {
        throw ApiError.badRequest(
            `Vehicle is not currently undergoing maintenance (current status: ${vehicle.status})`,
        );
    }

    let updatedLog;

    const parsedCompletedDate = completedDate
        ? new Date(completedDate)
        : new Date();

    await db.transaction(async (tx) => {
        // Update log details and mark Completed
        [updatedLog] = await tx
            .update(maintenanceLogs)
            .set({
                status: "Completed",
                completedDate: parsedCompletedDate,
                workshop: workshop || log.workshop,
                cost: cost || log.cost,
                maintenanceType: maintenanceType || log.maintenanceType,
                description: description || log.description,
            })
            .where(eq(maintenanceLogs.id, id))
            .returning();

        // Release Vehicle to "Available"
        await tx
            .update(vehicles)
            .set({
                status: "Available",
                updatedAt: new Date(),
            })
            .where(eq(vehicles.id, log.vehicleId));
    });

    return ApiResponse.ok(
        res,
        "Maintenance completed and vehicle is Available",
        { maintenanceLog: updatedLog },
    );
}
