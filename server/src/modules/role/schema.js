import * as z from "zod";

export const updatePermissionsSchema = z.strictObject({
    permissions: z.record(
        z.enum([
            "Analytics",
            "Vehicles",
            "Drivers",
            "Trips",
            "Maintenance",
            "Fuel",
            "Expenses",
            "Users",
            "Settings",
        ]),
        z.boolean({
            error: (issue) => "Allowed value must be a boolean",
        })
    ),
});
