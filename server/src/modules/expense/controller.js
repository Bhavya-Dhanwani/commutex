import { eq, or, ilike } from "drizzle-orm";

import db from "../../db/index.js";
import { expenses } from "../../db/schemas/expense.js";
import { vehicles } from "../../db/schemas/vehicle.js";
import { trips } from "../../db/schemas/trip.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export async function getExpenses(req, res) {
    const { search } = req.query;

    let query = db.select().from(expenses);

    if (search) {
        query = query.where(
            ilike(expenses.description, `%${search}%`)
        );
    }

    const list = await query;

    return ApiResponse.ok(res, "Expenses fetched successfully", { expenses: list });
}

export async function getExpenseById(req, res) {
    const { id } = req.params;

    const [expense] = await db
        .select()
        .from(expenses)
        .where(eq(expenses.id, id));

    if (!expense) {
        throw ApiError.notFound("Expense record not found");
    }

    return ApiResponse.ok(res, "Expense fetched successfully", { expense });
}

export async function createExpense(req, res) {
    const {
        vehicleId,
        tripId,
        category,
        amount,
        description,
        expenseDate,
    } = req.validatedData;

    // Verify vehicle exists
    const [vehicle] = await db
        .select()
        .from(vehicles)
        .where(eq(vehicles.id, vehicleId));

    if (!vehicle) {
        throw ApiError.notFound("Vehicle not found");
    }

    // Verify trip exists if provided
    if (tripId) {
        const [trip] = await db
            .select()
            .from(trips)
            .where(eq(trips.id, tripId));

        if (!trip) {
            throw ApiError.notFound("Trip not found");
        }
    }

    const parsedExpenseDate = expenseDate ? new Date(expenseDate) : new Date();

    const [expense] = await db
        .insert(expenses)
        .values({
            vehicleId,
            tripId,
            category,
            amount,
            description,
            expenseDate: parsedExpenseDate,
            createdBy: req.user.id,
        })
        .returning();

    return ApiResponse.created(res, "Expense created successfully", { expense });
}

export async function updateExpense(req, res) {
    const { id } = req.params;
    const updateData = req.validatedData;

    // Check expense exists
    const [expense] = await db
        .select()
        .from(expenses)
        .where(eq(expenses.id, id));

    if (!expense) {
        throw ApiError.notFound("Expense record not found");
    }

    // Verify vehicle exists if updated
    if (updateData.vehicleId && updateData.vehicleId !== expense.vehicleId) {
        const [vehicle] = await db
            .select()
            .from(vehicles)
            .where(eq(vehicles.id, updateData.vehicleId));

        if (!vehicle) {
            throw ApiError.notFound("Vehicle not found");
        }
    }

    // Verify trip exists if updated
    if (updateData.tripId && updateData.tripId !== expense.tripId) {
        const [trip] = await db
            .select()
            .from(trips)
            .where(eq(trips.id, updateData.tripId));

        if (!trip) {
            throw ApiError.notFound("Trip not found");
        }
    }

    const parsedData = { ...updateData };
    if (updateData.expenseDate) {
        parsedData.expenseDate = new Date(updateData.expenseDate);
    }

    const [updatedExpense] = await db
        .update(expenses)
        .set({
            ...parsedData,
        })
        .where(eq(expenses.id, id))
        .returning();

    return ApiResponse.ok(res, "Expense updated successfully", { expense: updatedExpense });
}
