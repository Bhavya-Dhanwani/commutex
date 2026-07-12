import { eq } from "drizzle-orm";
import db from "../db/index.js";
import { users } from "../db/schemas/user.js";
import { roles } from "../db/schemas/role.js";
import { permissions } from "../db/schemas/permission.js";

import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/tokens.js";

export async function getUser(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = verifyAccessToken(token);

        // Fetch user, role, and permissions dynamically from DB
        const [userWithRole] = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                isVerified: users.isVerified,
                roleId: users.roleId,
                roleName: roles.name,
            })
            .from(users)
            .leftJoin(roles, eq(users.roleId, roles.id))
            .where(eq(users.id, payload.id));

        if (userWithRole) {
            const userPermissions = await db
                .select()
                .from(permissions)
                .where(eq(permissions.roleId, userWithRole.roleId));

            const permissionsMap = {};
            userPermissions.forEach((p) => {
                permissionsMap[p.feature] = p.allowed;
            });

            req.user = {
                id: userWithRole.id,
                name: userWithRole.name,
                email: userWithRole.email,
                isVerified: userWithRole.isVerified,
                roleId: userWithRole.roleId,
                role: userWithRole.roleName || "User",
                permissions: permissionsMap,
            };
        } else {
            req.user = null;
        }
    } catch {
        req.user = null;
    }

    return next();
}

export function requireAuth(req, res, next) {
    if (!req.user) {
        return next(ApiError.unauthorized("Login required"));
    }

    return next();
}

export function requireVerified(req, _res, next) {
    if (!req.user.isVerified) {
        return next(ApiError.forbidden("Email not verified"));
    }

    return next();
}

export function requireNotVerified(req, res, next) {
    if (req.user.isVerified) {
        return next(ApiError.badRequest("You're already verified"));
    }

    return next();
}

export function requireAdmin(req, _res, next) {
    if (req.user?.role !== "Admin") {
        return next(ApiError.forbidden("Admin access required"));
    }

    return next();
}

export function requirePermission(feature) {
    return (req, _res, next) => {
        if (!req.user) {
            return next(ApiError.unauthorized("Login required"));
        }

        // Admin has full access to everything automatically
        if (req.user.role === "Admin") {
            return next();
        }

        if (req.user.permissions?.[feature] !== true) {
            return next(ApiError.forbidden(`Access denied: Permission for '${feature}' required`));
        }

        return next();
    };
}
