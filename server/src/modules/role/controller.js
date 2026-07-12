import { eq, and, ne } from "drizzle-orm";

import db from "../../db/index.js";
import { roles } from "../../db/schemas/role.js";
import { permissions } from "../../db/schemas/permission.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export async function getRoles(req, res) {
    // Retrieve all roles excluding Admin and User
    const list = await db
        .select()
        .from(roles)
        .where(
            and(
                ne(roles.name, "Admin"),
                ne(roles.name, "User")
            )
        );

    // Retrieve all permissions
    const allPermissions = await db
        .select()
        .from(permissions);

    const formattedRoles = list.map((role) => {
        const rolePermissions = allPermissions.filter((p) => p.roleId === role.id);
        const permissionsMap = {};
        rolePermissions.forEach((p) => {
            permissionsMap[p.feature] = p.allowed;
        });

        return {
            id: role.id,
            name: role.name,
            permissions: permissionsMap,
        };
    });

    return ApiResponse.ok(res, "Roles and permissions fetched successfully", {
        roles: formattedRoles,
    });
}

export async function updateRolePermissions(req, res) {
    const { id } = req.params;
    const { permissions: newPermissions } = req.validatedData;

    // Check if role exists
    const [role] = await db
        .select()
        .from(roles)
        .where(eq(roles.id, id));

    if (!role) {
        throw ApiError.notFound("Role not found");
    }

    // Restrict editing permissions for Admin and User roles
    if (role.name === "Admin" || role.name === "User") {
        throw ApiError.badRequest(`Permissions for the '${role.name}' role cannot be modified`);
    }

    const updates = Object.entries(newPermissions);

    await db.transaction(async (tx) => {
        for (const [feature, allowed] of updates) {
            await tx
                .insert(permissions)
                .values({
                    roleId: id,
                    feature,
                    allowed,
                })
                .onConflictDoUpdate({
                    target: [permissions.roleId, permissions.feature],
                    set: {
                        allowed,
                        updatedAt: new Date(),
                    },
                });
        }
    });

    // Fetch and return the updated permissions
    const updatedPermissions = await db
        .select()
        .from(permissions)
        .where(eq(permissions.roleId, id));

    const permissionsMap = {};
    updatedPermissions.forEach((p) => {
        permissionsMap[p.feature] = p.allowed;
    });

    return ApiResponse.ok(res, "Role permissions updated successfully", {
        role: {
            id: role.id,
            name: role.name,
            permissions: permissionsMap,
        },
    });
}
