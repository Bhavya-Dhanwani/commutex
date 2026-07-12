import * as z from "zod";

export const createFuelLogSchema = z.strictObject({
    vehicleId: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Vehicle ID is required"
                    : "Vehicle ID must be a string",
        })
        .uuid("Vehicle ID must be a valid UUID"),

    tripId: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Trip ID is required"
                    : "Trip ID must be a string",
        })
        .uuid("Trip ID must be a valid UUID")
        .optional(),

    liters: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Liters is required"
                    : "Liters must be a string",
        })
        .regex(/^\d+(\.\d{1,2})?$/, "Liters must be a valid number with up to 2 decimal places")
        .optional(),

    cost: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Cost is required"
                    : "Cost must be a string",
        })
        .regex(/^\d+(\.\d{1,2})?$/, "Cost must be a valid number with up to 2 decimal places")
        .optional(),

    fuelStation: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Fuel station is required"
                    : "Fuel station must be a string",
        })
        .trim()
        .max(150, "Fuel station should be of 150 chars max")
        .optional(),

    odometer: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? "Odometer is required"
                    : "Odometer must be a number",
        })
        .int("Odometer must be an integer")
        .nonnegative("Odometer cannot be negative")
        .optional(),

    filledOn: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Filled on date is required"
                    : "Filled on date must be a string",
        })
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
        .optional(),
});

export const updateFuelLogSchema = z.strictObject({
    vehicleId: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Vehicle ID is required"
                    : "Vehicle ID must be a string",
        })
        .uuid("Vehicle ID must be a valid UUID")
        .optional(),

    tripId: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Trip ID is required"
                    : "Trip ID must be a string",
        })
        .uuid("Trip ID must be a valid UUID")
        .optional(),

    liters: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Liters is required"
                    : "Liters must be a string",
        })
        .regex(/^\d+(\.\d{1,2})?$/, "Liters must be a valid number with up to 2 decimal places")
        .optional(),

    cost: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Cost is required"
                    : "Cost must be a string",
        })
        .regex(/^\d+(\.\d{1,2})?$/, "Cost must be a valid number with up to 2 decimal places")
        .optional(),

    fuelStation: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Fuel station is required"
                    : "Fuel station must be a string",
        })
        .trim()
        .max(150, "Fuel station should be of 150 chars max")
        .optional(),

    odometer: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? "Odometer is required"
                    : "Odometer must be a number",
        })
        .int("Odometer must be an integer")
        .nonnegative("Odometer cannot be negative")
        .optional(),

    filledOn: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Filled on date is required"
                    : "Filled on date must be a string",
        })
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
        .optional(),
});
