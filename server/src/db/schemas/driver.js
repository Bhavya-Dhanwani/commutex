import {
    pgTable,
    uuid,
    varchar,
    integer,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";

export const driverStatus = pgEnum("driver_status", [
    "Available",
    "On Trip",
    "Off Duty",
    "Suspended",
]);

export const drivers = pgTable("drivers", {
    id: uuid("id").primaryKey().defaultRandom(),

    name: varchar("name", { length: 100 }).notNull(),
    employeeId: varchar("employee_id", { length: 50 }),

    phone: varchar("phone", { length: 10 }),
    email: varchar("email", { length: 255 }),
    address: varchar("address", { length: 255 }),

    licenseNumber: varchar("license_number", { length: 50 }).unique().notNull(),
    licenseCategory: varchar("license_category", {
        length: 20,
    }),
    licenseExpiry: timestamp("license_expiry"),

    safetyScore: integer("safety_score").default(100),
    experienceYears: integer("experience_years"),

    status: driverStatus("status").default("Available"),

    emergencyContactName: varchar("emergency_name", {
        length: 100,
    }),
    emergencyContactPhone: varchar("emergency_phone", {
        length: 10,
    }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});
