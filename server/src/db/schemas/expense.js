import {
    pgTable,
    uuid,
    varchar,
    numeric,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";

import { vehicles } from "./vehicle.js";
import { trips } from "./trip.js";
import { users } from "./user.js";

export const expenseCategory = pgEnum("expense_category", [
    "Fuel",
    "Maintenance",
    "Toll",
    "Parking",
    "Insurance",
    "Fine",
    "Other",
]);

export const expenses = pgTable("expenses", {
    id: uuid("id").primaryKey().defaultRandom(),

    vehicleId: uuid("vehicle_id")
        .references(() => vehicles.id)
        .notNull(),

    tripId: uuid("trip_id").references(() => trips.id),

    category: expenseCategory("category").notNull(),

    amount: numeric("amount", {
        precision: 10,
        scale: 2,
    }),

    description: varchar("description", {
        length: 500,
    }),

    expenseDate: timestamp("expense_date"),

    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
