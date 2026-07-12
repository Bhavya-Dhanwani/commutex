import {
    pgTable,
    uuid,
    varchar,
    integer,
    numeric,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";

import { vehicles } from "./vehicle.js";
import { drivers } from "./driver.js";
import { users } from "./user.js";

export const tripStatus = pgEnum("trip_status", [
    "Draft",
    "Dispatched",
    "Completed",
    "Cancelled",
]);

export const trips = pgTable("trips", {
    id: uuid("id").primaryKey().defaultRandom(),

    tripNumber: varchar("trip_number", { length: 30 }).unique().notNull(),

    vehicleId: uuid("vehicle_id")
        .references(() => vehicles.id)
        .notNull(),
    driverId: uuid("driver_id")
        .references(() => drivers.id)
        .notNull(),

    source: varchar("source", { length: 255 }),
    destination: varchar("destination", { length: 255 }),

    cargoWeight: integer("cargo_weight"),
    plannedDistance: integer("planned_distance"),
    actualDistance: integer("actual_distance"),
    dispatchDate: timestamp("dispatch_date"),
    expectedArrival: timestamp("expected_arrival"),
    completedDate: timestamp("completed_date"),

    startOdometer: integer("start_odometer"),
    endOdometer: integer("end_odometer"),

    revenue: numeric("revenue", {
        precision: 12,
        scale: 2,
    }),
    fuelConsumed: numeric("fuel_consumed", {
        precision: 8,
        scale: 2,
    }),

    status: tripStatus("status").default("Draft"),

    createdBy: uuid("created_by").references(() => users.id),

    remarks: varchar("remarks", { length: 500 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});
