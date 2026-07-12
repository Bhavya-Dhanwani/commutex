import {
    pgTable,
    uuid,
    varchar,
    numeric,
    integer,
    timestamp,
    pgEnum,
    text,
} from "drizzle-orm/pg-core";

import { users } from "./user.js";

export const vehicleStatus = pgEnum("vehicle_status", [
    "Available",
    "On Trip",
    "In Shop",
    "Retired",
]);

export const vehicleType = pgEnum("vehicle_type", [
    "Truck",
    "Van",
    "Mini Truck",
    "Trailer",
    "Container",
]);

export const vehicles = pgTable("vehicles", {
    id: uuid("id").primaryKey().defaultRandom(),

    registrationNumber: varchar("registration_number", { length: 30 })
        .unique()
        .notNull(),

    model: varchar("model", { length: 100 }).notNull(),
    type: vehicleType("type").notNull(),
    maxLoadCapacity: integer("max_load_capacity").notNull(),
    odometer: integer("odometer").default(0),

    acquisitionCost: numeric("acquisition_cost", {
        precision: 12,
        scale: 2,
    }),

    purchaseDate: timestamp("purchase_date"),
    status: vehicleStatus("status").default("Available"),
    region: varchar("region", { length: 100 }),
    notes: text("notes"),

    createdBy: uuid("created_by").references(() => users.id),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});
