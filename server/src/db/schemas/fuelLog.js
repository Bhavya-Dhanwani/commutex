import {
    pgTable,
    uuid,
    numeric,
    integer,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

import { vehicles } from "./vehicle.js";
import { trips } from "./trip.js";
import { users } from "./user.js";

export const fuelLogs = pgTable("fuel_logs", {
    id: uuid("id").primaryKey().defaultRandom(),

    vehicleId: uuid("vehicle_id")
        .references(() => vehicles.id)
        .notNull(),

    tripId: uuid("trip_id").references(() => trips.id),

    liters: numeric("liters", {
        precision: 8,
        scale: 2,
    }),

    cost: numeric("cost", {
        precision: 10,
        scale: 2,
    }),

    fuelStation: varchar("fuel_station", {
        length: 150,
    }),

    odometer: integer("odometer"),

    filledOn: timestamp("filled_on"),

    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
