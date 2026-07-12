import {
    pgTable,
    uuid,
    varchar,
    boolean,
    timestamp,
} from "drizzle-orm/pg-core";

import { roles } from "./role.js";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),

    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),

    roleId: uuid("role_id").references(() => roles.id),

    verificationToken: varchar("verification_token", { length: 255 }),
    verificationExpires: timestamp("verification_expires"),
    resetPasswordToken: varchar("reset_password_token", { length: 255 }),
    resetPasswordExpires: timestamp("reset_password_expires"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});
