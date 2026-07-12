import * as z from "zod";

export const createMaintenanceSchema = z.strictObject({
    vehicleId: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Vehicle ID is required"
                    : "Vehicle ID must be a string",
        })
        .uuid("Vehicle ID must be a valid UUID"),

    maintenanceType: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Maintenance type is required"
                    : "Maintenance type must be a string",
        })
        .trim()
        .max(100, "Maintenance type should be of 100 chars max")
        .optional(),

    description: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Description is required"
                    : "Description must be a string",
        })
        .trim()
        .max(500, "Description should be of 500 chars max")
        .optional(),

    workshop: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Workshop is required"
                    : "Workshop must be a string",
        })
        .trim()
        .max(150, "Workshop should be of 150 chars max")
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

    status: z
        .enum(["Active", "Completed"], {
            error: (issue) =>
                issue.input === undefined
                    ? "Status is required"
                    : "Invalid status value",
        })
        .default("Active")
        .optional(),
});

export const updateMaintenanceSchema = z.strictObject({
    vehicleId: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Vehicle ID is required"
                    : "Vehicle ID must be a string",
        })
        .uuid("Vehicle ID must be a valid UUID")
        .optional(),

    maintenanceType: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Maintenance type is required"
                    : "Maintenance type must be a string",
        })
        .trim()
        .max(100, "Maintenance type should be of 100 chars max")
        .optional(),

    description: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Description is required"
                    : "Description must be a string",
        })
        .trim()
        .max(500, "Description should be of 500 chars max")
        .optional(),

    workshop: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Workshop is required"
                    : "Workshop must be a string",
        })
        .trim()
        .max(150, "Workshop should be of 150 chars max")
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

    status: z
        .enum(["Active", "Completed"], {
            error: (issue) =>
                issue.input === undefined
                    ? "Status is required"
                    : "Invalid status value",
        })
        .optional(),
});

export const completeMaintenanceSchema = z.strictObject({
    workshop: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Workshop is required"
                    : "Workshop must be a string",
        })
        .trim()
        .max(150, "Workshop should be of 150 chars max")
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

    maintenanceType: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Maintenance type is required"
                    : "Maintenance type must be a string",
        })
        .trim()
        .max(100, "Maintenance type should be of 100 chars max")
        .optional(),

    description: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Description is required"
                    : "Description must be a string",
        })
        .trim()
        .max(500, "Description should be of 500 chars max")
        .optional(),

    completedDate: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Completed date is required"
                    : "Completed date must be a string",
        })
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
        .optional(),
});
