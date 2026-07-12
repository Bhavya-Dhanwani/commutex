import { Router } from "express";

import {
    getFleetUtilization,
    getFuelEfficiency,
    getVehicleRoi,
    getExpensesAnalytics,
    getRevenueAnalytics,
    getMaintenanceAnalytics,
} from "./controller.js";

import { requireAuth, requireAnalyticsAccess } from "../../middlewares/auth.js";

const router = Router();

router.use(requireAuth, requireAnalyticsAccess);

router.get("/fleet-utilization", getFleetUtilization);
router.get("/fuel-efficiency", getFuelEfficiency);
router.get("/vehicle-roi", getVehicleRoi);
router.get("/expenses", getExpensesAnalytics);
router.get("/revenue", getRevenueAnalytics);
router.get("/maintenance", getMaintenanceAnalytics);

export default router;
