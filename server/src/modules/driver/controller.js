import { eq, and, ne } from "drizzle-orm";

import db from "../../db/index.js";
import { drivers } from "../../db/schemas/driver.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export async function getDrivers(req, res) {
    const list = await db.select().from(drivers);

    return ApiResponse.ok(res, "Drivers fetched successfully", {
        drivers: list,
    });
}

export async function getDriverById(req, res) {
    const { id } = req.params;

    const [driver] = await db.select().from(drivers).where(eq(drivers.id, id));

    if (!driver) {
        throw ApiError.notFound("Driver not found");
    }

    return ApiResponse.ok(res, "Driver fetched successfully", { driver });
}

export async function createDriver(req, res) {
    const {
        name,
        employeeId,
        phone,
        email,
        address,
        licenseNumber,
        licenseCategory,
        licenseExpiry,
        safetyScore,
        experienceYears,
        status,
        emergencyContactName,
        emergencyContactPhone,
    } = req.validatedData;

    const [existingDriver] = await db
        .select()
        .from(drivers)
        .where(eq(drivers.licenseNumber, licenseNumber));

    if (existingDriver) {
        throw ApiError.conflict(
            "Driver with this license number already exists",
        );
    }

    const parsedLicenseExpiry = licenseExpiry ? new Date(licenseExpiry) : null;

    const [driver] = await db
        .insert(drivers)
        .values({
            name,
            employeeId,
            phone,
            email,
            address,
            licenseNumber,
            licenseCategory,
            licenseExpiry: parsedLicenseExpiry,
            safetyScore,
            experienceYears,
            status,
            emergencyContactName,
            emergencyContactPhone,
        })
        .returning();

    return ApiResponse.created(res, "Driver created successfully", { driver });
}

export async function updateDriver(req, res) {
    const { id } = req.params;
    const updateData = req.validatedData;

    const [driver] = await db.select().from(drivers).where(eq(drivers.id, id));

    if (!driver) {
        throw ApiError.notFound("Driver not found");
    }

    if (updateData.licenseNumber) {
        const [existingDriver] = await db
            .select()
            .from(drivers)
            .where(
                and(
                    eq(drivers.licenseNumber, updateData.licenseNumber),
                    ne(drivers.id, id),
                ),
            );

        if (existingDriver) {
            throw ApiError.conflict(
                "Driver with this license number already exists",
            );
        }
    }

    const parsedData = { ...updateData };
    if (updateData.licenseExpiry) {
        parsedData.licenseExpiry = new Date(updateData.licenseExpiry);
    }

    const [updatedDriver] = await db
        .update(drivers)
        .set({
            ...parsedData,
            updatedAt: new Date(),
        })
        .where(eq(drivers.id, id))
        .returning();

    return ApiResponse.ok(res, "Driver updated successfully", {
        driver: updatedDriver,
    });
}
