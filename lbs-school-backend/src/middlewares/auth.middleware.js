import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    const token =
        req.cookies?.accessToken ||
        req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized - access token is missing");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );

        if (!user) {
            throw new ApiError(401, "Unauthorized - user not found");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

export const requireRoles = (...roles) => {
    return (req, _, next) => {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, "Forbidden - insufficient permissions");
        }

        next();
    };
};
