import { eq } from "drizzle-orm";

import db from "../../db/index.js";
import { vehicles } from "../../db/schemas/vehicle.js";
import { trips } from "../../db/schemas/trip.js";
import { expenses } from "../../db/schemas/expense.js";
import { maintenanceLogs } from "../../db/schemas/maintenance.js";
import ApiResponse from "../../utils/ApiResponse.js";

export async function getFleetUtilization(req, res) {
    const allVehicles = await db.select().from(vehicles);
    const totalVehicles = allVehicles.length;

    const statusCounts = {
        Available: 0,
        "On Trip": 0,
        "In Shop": 0,
        Retired: 0,
    };

    allVehicles.forEach((v) => {
        if (statusCounts[v.status] !== undefined) {
            statusCounts[v.status]++;
        }
    });

    const activeVehicles = statusCounts["On Trip"];
    const operationalVehicles = totalVehicles - statusCounts["Retired"];
    const utilizationRate = operationalVehicles > 0 ? (activeVehicles / operationalVehicles) * 100 : 0;

    const allTrips = await db.select().from(trips);
    const totalTrips = allTrips.length;

    const tripStatusCounts = {
        Draft: 0,
        Dispatched: 0,
        Completed: 0,
        Cancelled: 0,
    };

    allTrips.forEach((t) => {
        if (tripStatusCounts[t.status] !== undefined) {
            tripStatusCounts[t.status]++;
        }
    });

    return ApiResponse.ok(res, "Fleet utilization metrics fetched successfully", {
        vehicles: {
            total: totalVehicles,
            byStatus: statusCounts,
            utilizationRate: parseFloat(utilizationRate.toFixed(2)),
        },
        trips: {
            total: totalTrips,
            byStatus: tripStatusCounts,
        },
    });
}

export async function getFuelEfficiency(req, res) {
    const completedTrips = await db
        .select()
        .from(trips)
        .where(eq(trips.status, "Completed"));

    const allVehicles = await db.select().from(vehicles);
    const vehicleMap = new Map(allVehicles.map((v) => [v.id, v]));

    let totalDistance = 0;
    let totalFuel = 0;
    const vehicleEfficiency = {};

    completedTrips.forEach((t) => {
        const distance = t.actualDistance || 0;
        const fuel = parseFloat(t.fuelConsumed) || 0;

        if (distance > 0 && fuel > 0) {
            totalDistance += distance;
            totalFuel += fuel;

            if (!vehicleEfficiency[t.vehicleId]) {
                const v = vehicleMap.get(t.vehicleId);
                vehicleEfficiency[t.vehicleId] = {
                    registrationNumber: v?.registrationNumber || "Unknown",
                    model: v?.model || "Unknown",
                    distance: 0,
                    fuel: 0,
                };
            }
            vehicleEfficiency[t.vehicleId].distance += distance;
            vehicleEfficiency[t.vehicleId].fuel += fuel;
        }
    });

    const vehicleList = Object.values(vehicleEfficiency).map((ve) => ({
        registrationNumber: ve.registrationNumber,
        model: ve.model,
        totalDistance: ve.distance,
        totalFuelConsumed: parseFloat(ve.fuel.toFixed(2)),
        efficiencyKmPerLiter: ve.fuel > 0 ? parseFloat((ve.distance / ve.fuel).toFixed(2)) : 0,
    }));

    const averageKmPerLiter = totalFuel > 0 ? parseFloat((totalDistance / totalFuel).toFixed(2)) : 0;

    return ApiResponse.ok(res, "Fuel efficiency analytics fetched successfully", {
        averageKmPerLiter,
        totalDistance,
        totalFuelConsumed: parseFloat(totalFuel.toFixed(2)),
        byVehicle: vehicleList,
    });
}

export async function getVehicleRoi(req, res) {
    const allVehicles = await db.select().from(vehicles);
    const allExpenses = await db.select().from(expenses);
    const allMaintenance = await db.select().from(maintenanceLogs);
    const completedTrips = await db
        .select()
        .from(trips)
        .where(eq(trips.status, "Completed"));

    const roiData = allVehicles.map((v) => {
        const vExpenses = allExpenses
            .filter((e) => e.vehicleId === v.id)
            .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

        const vMaintenance = allMaintenance
            .filter((m) => m.vehicleId === v.id)
            .reduce((sum, m) => sum + (parseFloat(m.cost) || 0), 0);

        const vRevenue = completedTrips
            .filter((t) => t.vehicleId === v.id)
            .reduce((sum, t) => sum + (parseFloat(t.revenue) || 0), 0);

        const acquisitionCost = parseFloat(v.acquisitionCost) || 0;
        const totalExpenses = vExpenses + vMaintenance;
        const netProfit = vRevenue - totalExpenses;
        const roiPercentage = acquisitionCost > 0 ? (netProfit / acquisitionCost) * 100 : 0;

        return {
            registrationNumber: v.registrationNumber,
            model: v.model,
            acquisitionCost: parseFloat(acquisitionCost.toFixed(2)),
            totalRevenue: parseFloat(vRevenue.toFixed(2)),
            totalExpenses: parseFloat(totalExpenses.toFixed(2)),
            netProfit: parseFloat(netProfit.toFixed(2)),
            roiPercentage: parseFloat(roiPercentage.toFixed(2)),
        };
    });

    return ApiResponse.ok(res, "Vehicle ROI metrics fetched successfully", {
        roi: roiData,
    });
}

export async function getExpensesAnalytics(req, res) {
    const allExpenses = await db.select().from(expenses);
    const allVehicles = await db.select().from(vehicles);
    const vehicleMap = new Map(allVehicles.map((v) => [v.id, v]));

    let totalExpensesSum = 0;
    const byCategory = {};
    const byVehicle = {};
    const trend = {};

    allExpenses.forEach((e) => {
        const amount = parseFloat(e.amount) || 0;
        totalExpensesSum += amount;

        byCategory[e.category] = (byCategory[e.category] || 0) + amount;

        if (!byVehicle[e.vehicleId]) {
            const v = vehicleMap.get(e.vehicleId);
            byVehicle[e.vehicleId] = {
                registrationNumber: v?.registrationNumber || "Unknown",
                model: v?.model || "Unknown",
                amount: 0,
            };
        }
        byVehicle[e.vehicleId].amount += amount;

        if (e.expenseDate) {
            const month = new Date(e.expenseDate).toISOString().substring(0, 7);
            trend[month] = (trend[month] || 0) + amount;
        }
    });

    const categoryBreakdown = Object.entries(byCategory).map(([category, amount]) => ({
        category,
        amount: parseFloat(amount.toFixed(2)),
    }));

    const vehicleBreakdown = Object.values(byVehicle).map((vb) => ({
        registrationNumber: vb.registrationNumber,
        model: vb.model,
        amount: parseFloat(vb.amount.toFixed(2)),
    }));

    const trendBreakdown = Object.entries(trend)
        .map(([month, amount]) => ({ month, amount: parseFloat(amount.toFixed(2)) }))
        .sort((a, b) => a.month.localeCompare(b.month));

    return ApiResponse.ok(res, "Expense analytics metrics fetched successfully", {
        totalExpenses: parseFloat(totalExpensesSum.toFixed(2)),
        byCategory: categoryBreakdown,
        byVehicle: vehicleBreakdown,
        trend: trendBreakdown,
    });
}

export async function getRevenueAnalytics(req, res) {
    const completedTrips = await db
        .select()
        .from(trips)
        .where(eq(trips.status, "Completed"));

    const allVehicles = await db.select().from(vehicles);
    const vehicleMap = new Map(allVehicles.map((v) => [v.id, v]));

    let totalRevenueSum = 0;
    const byVehicle = {};
    const trend = {};

    completedTrips.forEach((t) => {
        const revenue = parseFloat(t.revenue) || 0;
        totalRevenueSum += revenue;

        if (!byVehicle[t.vehicleId]) {
            const v = vehicleMap.get(t.vehicleId);
            byVehicle[t.vehicleId] = {
                registrationNumber: v?.registrationNumber || "Unknown",
                model: v?.model || "Unknown",
                revenue: 0,
            };
        }
        byVehicle[t.vehicleId].revenue += revenue;

        const dateToUse = t.completedDate || t.dispatchDate || t.createdAt;
        if (dateToUse) {
            const month = new Date(dateToUse).toISOString().substring(0, 7);
            trend[month] = (trend[month] || 0) + revenue;
        }
    });

    const vehicleBreakdown = Object.values(byVehicle).map((vb) => ({
        registrationNumber: vb.registrationNumber,
        model: vb.model,
        revenue: parseFloat(vb.revenue.toFixed(2)),
    }));

    const trendBreakdown = Object.entries(trend)
        .map(([month, revenue]) => ({ month, revenue: parseFloat(revenue.toFixed(2)) }))
        .sort((a, b) => a.month.localeCompare(b.month));

    return ApiResponse.ok(res, "Revenue analytics metrics fetched successfully", {
        totalRevenue: parseFloat(totalRevenueSum.toFixed(2)),
        byVehicle: vehicleBreakdown,
        trend: trendBreakdown,
    });
}

export async function getMaintenanceAnalytics(req, res) {
    const allLogs = await db.select().from(maintenanceLogs);
    const allVehicles = await db.select().from(vehicles);
    const vehicleMap = new Map(allVehicles.map((v) => [v.id, v]));

    let totalCost = 0;
    const byStatus = { Active: 0, Completed: 0 };
    const byType = {};
    const byVehicle = {};

    allLogs.forEach((m) => {
        const cost = parseFloat(m.cost) || 0;
        totalCost += cost;

        if (byStatus[m.status] !== undefined) {
            byStatus[m.status]++;
        }

        const type = m.maintenanceType || "Other";
        if (!byType[type]) {
            byType[type] = { count: 0, cost: 0 };
        }
        byType[type].count++;
        byType[type].cost += cost;

        if (!byVehicle[m.vehicleId]) {
            const v = vehicleMap.get(m.vehicleId);
            byVehicle[m.vehicleId] = {
                registrationNumber: v?.registrationNumber || "Unknown",
                model: v?.model || "Unknown",
                count: 0,
                cost: 0,
            };
        }
        byVehicle[m.vehicleId].count++;
        byVehicle[m.vehicleId].cost += cost;
    });

    const typeBreakdown = Object.entries(byType).map(([type, data]) => ({
        type,
        count: data.count,
        totalCost: parseFloat(data.cost.toFixed(2)),
    }));

    const vehicleBreakdown = Object.values(byVehicle).map((vb) => ({
        registrationNumber: vb.registrationNumber,
        model: vb.model,
        count: vb.count,
        totalCost: parseFloat(vb.cost.toFixed(2)),
    }));

    return ApiResponse.ok(res, "Maintenance analytics metrics fetched successfully", {
        totalCost: parseFloat(totalCost.toFixed(2)),
        byStatus,
        byType: typeBreakdown,
        byVehicle: vehicleBreakdown,
    });
}
