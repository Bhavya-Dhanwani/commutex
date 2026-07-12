import { Router } from "express";

import {
    getFleetUtilization,
    getFuelEfficiency,
    getVehicleRoi,
    getExpensesAnalytics,
    getRevenueAnalytics,
    getMaintenanceAnalytics,
    getRecentActivity,
} from "./controller.js";

import { requireAuth, requirePermission } from "../../middlewares/auth.js";

const router = Router();

// Protect all routes: check dynamic permissions for Analytics access
router.use(requireAuth, requirePermission("Analytics"));

router.get("/fleet-utilization", getFleetUtilization);
router.get("/fuel-efficiency", getFuelEfficiency);
router.get("/vehicle-roi", getVehicleRoi);
router.get("/expenses", getExpensesAnalytics);
router.get("/revenue", getRevenueAnalytics);
router.get("/maintenance", getMaintenanceAnalytics);
router.get("/recent", getRecentActivity);

export default router;
