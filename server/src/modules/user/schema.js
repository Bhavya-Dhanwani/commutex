import * as z from "zod";

export const updateRoleSchema = z.strictObject({
    role: z.enum(
        [
            "Admin",
            "Fleet Manager",
            "Dispatcher",
            "Safety Officer",
            "Financial Analyst",
        ],
        {
            error: (issue) =>
                issue.input === undefined
                    ? "Role is required"
                    : `Role must be one of the following: Admin, Fleet Manager, Dispatcher, Safety Officer, Financial Analyst`,
        },
    ),
});
