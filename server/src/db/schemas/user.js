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

    roleId: uuid("role_id")
        .references(() => roles.id)
        .notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});
