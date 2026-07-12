import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/tokens.js";

export function getUser(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = verifyAccessToken(token);
        req.user = payload;
    } catch {
        req.user = null;
    }

    return next();
}

export function requireAuth(req, res, next) {
    if (!req.user) {
        return next(ApiError.unauthorized("Login required"));
    }

    return next();
}

export function requireVerified(req, _res, next) {
    if (!req.user.isVerified) {
        return next(ApiError.forbidden("Email not verified"));
    }

    return next();
}

export function requireNotVerified(req, res, next) {
    if (req.user.isVerified) {
        return next(ApiError.badRequest("You're already verified"));
    }

    return next();
}

export function requireAdmin(req, _res, next) {
    if (req.user?.role !== "Admin") {
        return next(ApiError.forbidden("Admin access required"));
    }

    return next();
}

export function requireFleetManagerOrAdmin(req, _res, next) {
    const role = req.user?.role;
    if (role !== "Fleet Manager" && role !== "Admin") {
        return next(ApiError.forbidden("Access denied: Fleet Manager or Admin role required"));
    }

    return next();
}

export function requireSafetyOfficerOrAdmin(req, _res, next) {
    const role = req.user?.role;
    if (role !== "Safety Officer" && role !== "Admin") {
        return next(ApiError.forbidden("Access denied: Safety Officer or Admin role required"));
    }

    return next();
}

export function requireDispatcherOrAdmin(req, _res, next) {
    const role = req.user?.role;
    if (role !== "Dispatcher" && role !== "Admin") {
        return next(ApiError.forbidden("Access denied: Dispatcher or Admin role required"));
    }

    return next();
}
