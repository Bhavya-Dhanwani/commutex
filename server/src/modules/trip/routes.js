import { Router } from "express";

import {
    getTrips,
    getTripById,
    createTrip,
    updateTrip,
    dispatchTrip,
    completeTrip,
    cancelTrip,
} from "./controller.js";

import {
    createTripSchema,
    updateTripSchema,
    completeTripSchema,
} from "./schema.js";

import {
    requireAuth,
    requireDispatcherOrAdmin,
} from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";

const router = Router();

router.use(requireAuth, requireDispatcherOrAdmin);

router.get("/", getTrips);
router.get("/:id", getTripById);
router.post("/", validate(createTripSchema), createTrip);
router.patch("/:id", validate(updateTripSchema), updateTrip);

router.patch("/:id/dispatch", dispatchTrip);
router.patch("/:id/complete", validate(completeTripSchema), completeTrip);
router.patch("/:id/cancel", cancelTrip);

export default router;
