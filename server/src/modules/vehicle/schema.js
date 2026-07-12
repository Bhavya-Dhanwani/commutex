import * as z from "zod";

export const createVehicleSchema = z.strictObject({
    registrationNumber: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Registration number is required"
                    : "Registration number must be a string",
        })
        .trim()
        .min(1, "Registration number is required")
        .max(30, "Registration number should be of 30 chars max"),

    model: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Model is required"
                    : "Model must be a string",
        })
        .trim()
        .min(1, "Model is required")
        .max(100, "Model should be of 100 chars max"),

    type: z.enum(["Truck", "Van", "Mini Truck", "Trailer", "Container"], {
        error: (issue) =>
            issue.input === undefined
                ? "Type is required"
                : "Invalid vehicle type",
    }),

    maxLoadCapacity: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? "Max load capacity is required"
                    : "Max load capacity must be a number",
        })
        .int("Max load capacity must be an integer")
        .positive("Max load capacity must be a positive integer"),

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

    acquisitionCost: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Acquisition cost is required"
                    : "Acquisition cost must be a string",
        })
        .regex(/^\d+(\.\d{1,2})?$/, "Acquisition cost must be a valid number with up to 2 decimal places")
        .optional(),

    purchaseDate: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Purchase date is required"
                    : "Purchase date must be a string",
        })
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
        .optional(),

    status: z
        .enum(["Available", "On Trip", "In Shop", "Retired"], {
            error: (issue) =>
                issue.input === undefined
                    ? "Status is required"
                    : "Invalid status value",
        })
        .optional(),

    region: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Region is required"
                    : "Region must be a string",
        })
        .trim()
        .max(100, "Region should be of 100 chars max")
        .optional(),

    notes: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Notes is required"
                    : "Notes must be a string",
        })
        .trim()
        .optional(),
});

export const updateVehicleSchema = z.strictObject({
    registrationNumber: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Registration number is required"
                    : "Registration number must be a string",
        })
        .trim()
        .min(1, "Registration number cannot be empty")
        .max(30, "Registration number should be of 30 chars max")
        .optional(),

    model: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Model is required"
                    : "Model must be a string",
        })
        .trim()
        .min(1, "Model cannot be empty")
        .max(100, "Model should be of 100 chars max")
        .optional(),

    type: z
        .enum(["Truck", "Van", "Mini Truck", "Trailer", "Container"], {
            error: (issue) =>
                issue.input === undefined
                    ? "Type is required"
                    : "Invalid vehicle type",
        })
        .optional(),

    maxLoadCapacity: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? "Max load capacity is required"
                    : "Max load capacity must be a number",
        })
        .int("Max load capacity must be an integer")
        .positive("Max load capacity must be a positive integer")
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

    acquisitionCost: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Acquisition cost is required"
                    : "Acquisition cost must be a string",
        })
        .regex(/^\d+(\.\d{1,2})?$/, "Acquisition cost must be a valid number with up to 2 decimal places")
        .optional(),

    purchaseDate: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Purchase date is required"
                    : "Purchase date must be a string",
        })
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
        .optional(),

    status: z
        .enum(["Available", "On Trip", "In Shop", "Retired"], {
            error: (issue) =>
                issue.input === undefined
                    ? "Status is required"
                    : "Invalid status value",
        })
        .optional(),

    region: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Region is required"
                    : "Region must be a string",
        })
        .trim()
        .max(100, "Region should be of 100 chars max")
        .optional(),

    notes: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Notes is required"
                    : "Notes must be a string",
        })
        .trim()
        .optional(),
});
