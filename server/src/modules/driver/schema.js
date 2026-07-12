import * as z from "zod";

export const createDriverSchema = z.strictObject({
    name: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Name is required"
                    : "Name must be a string",
        })
        .trim()
        .min(1, "Name is required")
        .max(100, "Name should be of 100 chars max"),

    employeeId: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Employee ID is required"
                    : "Employee ID must be a string",
        })
        .trim()
        .max(50, "Employee ID should be of 50 chars max")
        .optional(),

    phone: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Phone is required"
                    : "Phone must be a string",
        })
        .trim()
        .max(10, "Phone should be of 10 chars max")
        .optional(),

    email: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Email is required"
                    : "Email must be a string",
        })
        .trim()
        .email("Invalid email format")
        .max(255, "Email should be of 255 chars max")
        .optional(),

    address: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Address is required"
                    : "Address must be a string",
        })
        .trim()
        .max(255, "Address should be of 255 chars max")
        .optional(),

    licenseNumber: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "License number is required"
                    : "License number must be a string",
        })
        .trim()
        .min(1, "License number is required")
        .max(50, "License number should be of 50 chars max"),

    licenseCategory: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "License category is required"
                    : "License category must be a string",
        })
        .trim()
        .max(20, "License category should be of 20 chars max")
        .optional(),

    licenseExpiry: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "License expiry date is required"
                    : "License expiry date must be a string",
        })
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
        .optional(),

    safetyScore: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? "Safety score is required"
                    : "Safety score must be a number",
        })
        .int("Safety score must be an integer")
        .min(0, "Safety score cannot be negative")
        .max(100, "Safety score cannot exceed 100")
        .default(100)
        .optional(),

    experienceYears: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? "Experience years is required"
                    : "Experience years must be a number",
        })
        .int("Experience years must be an integer")
        .nonnegative("Experience years cannot be negative")
        .optional(),

    status: z
        .enum(["Available", "On Trip", "Off Duty", "Suspended"], {
            error: (issue) =>
                issue.input === undefined
                    ? "Status is required"
                    : "Invalid status value",
        })
        .default("Available")
        .optional(),

    emergencyContactName: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Emergency contact name is required"
                    : "Emergency contact name must be a string",
        })
        .trim()
        .max(100, "Emergency contact name should be of 100 chars max")
        .optional(),

    emergencyContactPhone: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Emergency contact phone is required"
                    : "Emergency contact phone must be a string",
        })
        .trim()
        .max(10, "Emergency contact phone should be of 10 chars max")
        .optional(),
});

export const updateDriverSchema = z.strictObject({
    name: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Name is required"
                    : "Name must be a string",
        })
        .trim()
        .min(1, "Name cannot be empty")
        .max(100, "Name should be of 100 chars max")
        .optional(),

    employeeId: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Employee ID is required"
                    : "Employee ID must be a string",
        })
        .trim()
        .max(50, "Employee ID should be of 50 chars max")
        .optional(),

    phone: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Phone is required"
                    : "Phone must be a string",
        })
        .trim()
        .max(10, "Phone should be of 10 chars max")
        .optional(),

    email: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Email is required"
                    : "Email must be a string",
        })
        .trim()
        .email("Invalid email format")
        .max(255, "Email should be of 255 chars max")
        .optional(),

    address: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Address is required"
                    : "Address must be a string",
        })
        .trim()
        .max(255, "Address should be of 255 chars max")
        .optional(),

    licenseNumber: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "License number is required"
                    : "License number must be a string",
        })
        .trim()
        .min(1, "License number cannot be empty")
        .max(50, "License number should be of 50 chars max")
        .optional(),

    licenseCategory: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "License category is required"
                    : "License category must be a string",
        })
        .trim()
        .max(20, "License category should be of 20 chars max")
        .optional(),

    licenseExpiry: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "License expiry date is required"
                    : "License expiry date must be a string",
        })
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
        .optional(),

    safetyScore: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? "Safety score is required"
                    : "Safety score must be a number",
        })
        .int("Safety score must be an integer")
        .min(0, "Safety score cannot be negative")
        .max(100, "Safety score cannot exceed 100")
        .optional(),

    experienceYears: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? "Experience years is required"
                    : "Experience years must be a number",
        })
        .int("Experience years must be an integer")
        .nonnegative("Experience years cannot be negative")
        .optional(),

    status: z
        .enum(["Available", "On Trip", "Off Duty", "Suspended"], {
            error: (issue) =>
                issue.input === undefined
                    ? "Status is required"
                    : "Invalid status value",
        })
        .optional(),

    emergencyContactName: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Emergency contact name is required"
                    : "Emergency contact name must be a string",
        })
        .trim()
        .max(100, "Emergency contact name should be of 100 chars max")
        .optional(),

    emergencyContactPhone: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Emergency contact phone is required"
                    : "Emergency contact phone must be a string",
        })
        .trim()
        .max(10, "Emergency contact phone should be of 10 chars max")
        .optional(),
});
