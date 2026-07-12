import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

import { getUser } from "./middlewares/auth.js";
app.use(getUser);

import corsOptions from "./config/cors.js";
app.use(cors(corsOptions));

// routes
app.get("/api/ping", (req, res) => {
    return res
        .status(200)
        .json({ success: true, message: "Server is running" });
});

import authRoutes from "./modules/auth/routes.js";
app.use("/api/auth", authRoutes);

import userRoutes from "./modules/user/routes.js";
app.use("/api/users", userRoutes);

import vehicleRoutes from "./modules/vehicle/routes.js";
app.use("/api/vehicles", vehicleRoutes);

import driverRoutes from "./modules/driver/routes.js";
app.use("/api/drivers", driverRoutes);

import tripRoutes from "./modules/trip/routes.js";
app.use("/api/trips", tripRoutes);

import maintenanceRoutes from "./modules/maintenance/routes.js";
app.use("/api/maintenance", maintenanceRoutes);

import fuelLogRoutes from "./modules/fuelLog/routes.js";
app.use("/api/fuel-logs", fuelLogRoutes);

// catch-all route
import ApiError from "./utils/ApiError.js";
app.all("{*path}", (req, res) => {
    throw ApiError.notFound(`Route ${req.originalUrl} not found`);
});

// global error handler
import errorHandler from "./middlewares/errorHandler.js";
app.use(errorHandler);

export default app;
