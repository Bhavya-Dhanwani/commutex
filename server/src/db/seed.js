import "dotenv/config";

import bcrypt from "bcrypt";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import db from "./index.js";
import { users } from "./schemas/user.js";
import { roles } from "./schemas/role.js";
import { permissions } from "./schemas/permission.js";
import { vehicles } from "./schemas/vehicle.js";
import { drivers } from "./schemas/driver.js";
import { trips } from "./schemas/trip.js";
import { maintenanceLogs } from "./schemas/maintenance.js";
import { fuelLogs } from "./schemas/fuelLog.js";
import { expenses } from "./schemas/expense.js";

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

const features = [
    "Analytics",
    "Vehicles",
    "Drivers",
    "Trips",
    "Maintenance",
    "Fuel",
    "Expenses",
    "Users",
    "Settings",
];

const defaultPermissions = {
    Admin: {
        Analytics: true,
        Vehicles: true,
        Drivers: true,
        Trips: true,
        Maintenance: true,
        Fuel: true,
        Expenses: true,
        Users: true,
        Settings: true,
    },
    "Fleet Manager": { Vehicles: true, Maintenance: true, Analytics: true },
    Dispatcher: { Trips: true, Vehicles: true, Drivers: true, Analytics: true },
    "Safety Officer": { Drivers: true, Analytics: true },
    "Financial Analyst": { Fuel: true, Expenses: true, Analytics: true },
    User: {},
};

export async function seedUsers() {
    console.log("Emptying database...");
    await db.delete(expenses);
    await db.delete(fuelLogs);
    await db.delete(maintenanceLogs);
    await db.delete(trips);
    await db.delete(vehicles);
    await db.delete(drivers);
    await db.delete(users);
    await db.delete(permissions);
    await db.delete(roles);
    console.log("Database cleared.");

    console.log("Seeding roles and permissions...");

    // Seed roles
    let roleList = await db.select().from(roles);
    if (roleList.length === 0) {
        roleList = await db
            .insert(roles)
            .values([
                { name: "Admin" },
                { name: "Fleet Manager" },
                { name: "Dispatcher" },
                { name: "Safety Officer" },
                { name: "Financial Analyst" },
                { name: "User" },
            ])
            .returning();
    }

    // Seed permissions
    const permissionRows = [];
    for (const role of roleList) {
        const allowedMap = defaultPermissions[role.name] || {};
        for (const feature of features) {
            permissionRows.push({
                roleId: role.id,
                feature,
                allowed: !!allowedMap[feature],
            });
        }
    }

    await db.insert(permissions).values(permissionRows).onConflictDoNothing();

    console.log("Roles and default permissions seeded successfully.");

    const roleMap = new Map(roleList.map((r) => [r.name, r.id]));
    const hashedPassword = await bcrypt.hash(demoPassword, 10);

    const rows = demoUsers.map((user) => ({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        isVerified: true,
        roleId: roleMap.get(user.role),
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
