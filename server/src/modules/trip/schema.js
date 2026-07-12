import * as z from "zod";

export const createTripSchema = z.strictObject({
    tripNumber: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Trip number is required"
                    : "Trip number must be a string",
        })
        .trim()
        .min(1, "Trip number is required")
        .max(30, "Trip number should be of 30 chars max"),

    vehicleId: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Vehicle ID is required"
                    : "Vehicle ID must be a string",
        })
        .uuid("Vehicle ID must be a valid UUID"),

    driverId: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Driver ID is required"
                    : "Driver ID must be a string",
        })
        .uuid("Driver ID must be a valid UUID"),

    source: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Source is required"
                    : "Source must be a string",
        })
        .trim()
        .max(255, "Source should be of 255 chars max")
        .optional(),

    destination: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Destination is required"
                    : "Destination must be a string",
        })
        .trim()
        .max(255, "Destination should be of 255 chars max")
        .optional(),

    cargoWeight: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? "Cargo weight is required"
                    : "Cargo weight must be a number",
        })
        .int("Cargo weight must be an integer")
        .positive("Cargo weight must be a positive integer")
        .optional(),

    plannedDistance: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? "Planned distance is required"
                    : "Planned distance must be a number",
        })
        .int("Planned distance must be an integer")
        .positive("Planned distance must be a positive integer")
        .optional(),

    expectedArrival: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Expected arrival is required"
                    : "Expected arrival must be a string",
        })
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
        .optional(),

    remarks: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Remarks is required"
                    : "Remarks must be a string",
        })
        .trim()
        .max(500, "Remarks should be of 500 chars max")
        .optional(),
});

export const updateTripSchema = z.strictObject({
    tripNumber: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Trip number is required"
                    : "Trip number must be a string",
        })
        .trim()
        .min(1, "Trip number cannot be empty")
        .max(30, "Trip number should be of 30 chars max")
        .optional(),

    vehicleId: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Vehicle ID is required"
                    : "Vehicle ID must be a string",
        })
        .uuid("Vehicle ID must be a valid UUID")
        .optional(),

    driverId: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Driver ID is required"
                    : "Driver ID must be a string",
        })
        .uuid("Driver ID must be a valid UUID")
        .optional(),

    source: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Source is required"
                    : "Source must be a string",
        })
        .trim()
        .max(255, "Source should be of 255 chars max")
        .optional(),

    destination: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Destination is required"
                    : "Destination must be a string",
        })
        .trim()
        .max(255, "Destination should be of 255 chars max")
        .optional(),

    cargoWeight: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? "Cargo weight is required"
                    : "Cargo weight must be a number",
        })
        .int("Cargo weight must be an integer")
        .positive("Cargo weight must be a positive integer")
        .optional(),

    plannedDistance: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? "Planned distance is required"
                    : "Planned distance must be a number",
        })
        .int("Planned distance must be an integer")
        .positive("Planned distance must be a positive integer")
        .optional(),

    expectedArrival: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Expected arrival is required"
                    : "Expected arrival must be a string",
        })
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
        .optional(),

    remarks: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Remarks is required"
                    : "Remarks must be a string",
        })
        .trim()
        .max(500, "Remarks should be of 500 chars max")
        .optional(),
});

export const completeTripSchema = z.strictObject({
    endOdometer: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? "End odometer is required"
                    : "End odometer must be a number",
        })
        .int("End odometer must be an integer")
        .positive("End odometer must be a positive integer"),

    actualDistance: z
        .number({
            error: (issue) =>
                issue.input === undefined
                    ? "Actual distance is required"
                    : "Actual distance must be a number",
        })
        .int("Actual distance must be an integer")
        .positive("Actual distance must be a positive integer")
        .optional(),

    fuelConsumed: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Fuel consumed is required"
                    : "Fuel consumed must be a string",
        })
        .regex(/^\d+(\.\d{1,2})?$/, "Fuel consumed must be a valid number with up to 2 decimal places")
        .optional(),

    revenue: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Revenue is required"
                    : "Revenue must be a string",
        })
        .regex(/^\d+(\.\d{1,2})?$/, "Revenue must be a valid number with up to 2 decimal places")
        .optional(),
});
