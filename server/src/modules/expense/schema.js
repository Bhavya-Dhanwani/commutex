import * as z from "zod";

export const createExpenseSchema = z.strictObject({
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

    category: z.enum(["Fuel", "Maintenance", "Toll", "Parking", "Insurance", "Fine", "Other"], {
        error: (issue) =>
            issue.input === undefined
                ? "Category is required"
                : "Invalid category value",
    }),

    amount: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Amount is required"
                    : "Amount must be a string",
        })
        .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid number with up to 2 decimal places"),

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

    expenseDate: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Expense date is required"
                    : "Expense date must be a string",
        })
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
        .optional(),
});

export const updateExpenseSchema = z.strictObject({
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

    category: z
        .enum(["Fuel", "Maintenance", "Toll", "Parking", "Insurance", "Fine", "Other"], {
            error: (issue) =>
                issue.input === undefined
                    ? "Category is required"
                    : "Invalid category value",
        })
        .optional(),

    amount: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Amount is required"
                    : "Amount must be a string",
        })
        .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid number with up to 2 decimal places")
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

    expenseDate: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Expense date is required"
                    : "Expense date must be a string",
        })
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
        .optional(),
});
