import {
    pgTable,
    uuid,
    varchar,
    numeric,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";

import { vehicles } from "./vehicle.js";
import { users } from "./user.js";

export const maintenanceStatus = pgEnum("maintenance_status", [
    "Active",
    "Completed",
]);

export const maintenanceLogs = pgTable("maintenance_logs", {
    id: uuid("id").primaryKey().defaultRandom(),

    vehicleId: uuid("vehicle_id")
        .references(() => vehicles.id)
        .notNull(),

    maintenanceType: varchar("maintenance_type", {
        length: 100,
    }),

    description: varchar("description", {
        length: 500,
    }),

    workshop: varchar("workshop", { length: 150 }),

    cost: numeric("cost", {
        precision: 10,
        scale: 2,
    }),

    startDate: timestamp("start_date"),
    completedDate: timestamp("completed_date"),
    status: maintenanceStatus("status").default("Active"),

    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
