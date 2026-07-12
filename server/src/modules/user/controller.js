import { eq, or, ilike } from "drizzle-orm";

import db from "../../db/index.js";
import { users } from "../../db/schemas/user.js";

import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export async function getAllUsers(req, res) {
    const { search } = req.query;

    let query = db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            isVerified: users.isVerified,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
        })
        .from(users);

    if (search) {
        query = query.where(
            or(
                ilike(users.name, `%${search}%`),
                ilike(users.email, `%${search}%`)
            )
        );
    }

    const allUsers = await query;

    return ApiResponse.ok(res, "Users fetched successfully", {
        users: allUsers,
    });
}

export async function getUserById(req, res) {
    const { id } = req.params;

    const [user] = await db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            isVerified: users.isVerified,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
        })
        .from(users)
        .where(eq(users.id, id));

    if (!user) {
        throw ApiError.notFound("User not found");
    }

    return ApiResponse.ok(res, "User fetched successfully", { user });
}

export async function updateUserRole(req, res) {
    const { id } = req.params;
    const { role } = req.validatedData;

    if (id === req.user.id) {
        throw ApiError.badRequest("You cannot modify your own role");
    }

    const [user] = await db.select().from(users).where(eq(users.id, id));

    if (!user) {
        throw ApiError.notFound("User not found");
    }

    const [updatedUser] = await db
        .update(users)
        .set({ role })
        .where(eq(users.id, id))
        .returning({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            isVerified: users.isVerified,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
        });

    return ApiResponse.ok(res, "User role updated successfully", {
        user: updatedUser,
    });
}
