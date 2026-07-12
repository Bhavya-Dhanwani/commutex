import "dotenv/config";

import bcrypt from "bcrypt";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import db from "./index.js";
import { users } from "./schemas/user.js";

const demoPassword = "Demo@123";

const demoUsers = [
    {
        name: "Admin User",
        email: "admin@commutex.local",
        role: "Admin",
    },
    {
        name: "Fleet Manager",
        email: "fleet.manager@commutex.local",
        role: "Fleet Manager",
    },
    {
        name: "Dispatcher",
        email: "dispatcher@commutex.local",
        role: "Dispatcher",
    },
    {
        name: "Safety Officer",
        email: "safety.officer@commutex.local",
        role: "Safety Officer",
    },
    {
        name: "Financial Analyst",
        email: "financial.analyst@commutex.local",
        role: "Financial Analyst",
    },
    {
        name: "General User",
        email: "user@commutex.local",
        role: "User",
    },
];

export async function seedUsers() {
    const hashedPassword = await bcrypt.hash(demoPassword, 10);

    const rows = demoUsers.map((user) => ({
        ...user,
        password: hashedPassword,
        isVerified: true,
    }));

    const insertedUsers = await db
        .insert(users)
        .values(rows)
        .onConflictDoNothing({
            target: users.email,
        })
        .returning({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
        });

    console.log(`Seeded ${insertedUsers.length} demo users.`);
    console.log(`Shared password: ${demoPassword}`);

    return insertedUsers;
}

if (import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    seedUsers()
        .catch((error) => {
            console.error("Seeding failed:", error);
            process.exitCode = 1;
        })
        .finally(() => {
            process.exit();
        });
}
