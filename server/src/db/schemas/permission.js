import {
    pgTable,
    uuid,
    varchar,
    boolean,
    timestamp,
    unique,
} from "drizzle-orm/pg-core";

import { roles } from "./role.js";

export const permissions = pgTable(
    "permissions",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        roleId: uuid("role_id")
            .references(() => roles.id, { onDelete: "cascade" })
            .notNull(),
        feature: varchar("feature", { length: 50 }).notNull(),
        allowed: boolean("allowed").default(false).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (t) => ({
        unq: unique("role_feature_unq").on(t.roleId, t.feature),
    })
);
