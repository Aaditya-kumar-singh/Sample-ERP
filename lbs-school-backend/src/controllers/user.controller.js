import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

// ── Helper: generate both tokens ────────────────────────────────────────────
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new ApiError(400, "User not found");

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

// ── POST /api/v1/users/register ──────────────────────────────────────────────
const registerUser = asyncHandler(async (req, res) => {
    const { fullname, username, email, password, role } = req.body;

    if ([fullname, username, email, password].some((f) => !f?.trim())) {
        throw new ApiError(400, "All fields (fullname, username, email, password) are required");
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) {
        throw new ApiError(409, "Username or email already taken");
    }

    const allowedSelfSignupRoles = ["parent", "student"];
    const safeRole = allowedSelfSignupRoles.includes(role) ? role : "parent";

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    let avatar = null;
    if (avatarLocalPath) {
        avatar = await uploadOnCloudinary(avatarLocalPath);
        if (!avatar) throw new ApiError(500, "Avatar upload failed");
    }

    try {
        const user = await User.create({
            fullname,
            email,
            username: username.toLowerCase(),
            password,
            role: safeRole,
            avatar: avatar?.url || "",
        });

        const createdUser = await User.findById(user._id).select("-password -refreshToken -__v");
        if (!createdUser) throw new ApiError(500, "Something went wrong while registering user");

        return res
            .status(201)
            .json(new ApiResponse(201, createdUser, "User registered successfully"));
    } catch (error) {
        if (avatar) await deleteFromCloudinary(avatar.public_id);
        throw new ApiError(500, "Registration failed — rolled back uploaded files");
    }
});

// ── POST /api/v1/users/login ─────────────────────────────────────────────────
const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!password || (!email && !username)) {
        throw new ApiError(400, "Email (or username) and password are required");
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) throw new ApiError(404, "User not found");

    const isValidPassword = await user.isPasswordCorrect(password);
    if (!isValidPassword) throw new ApiError(401, "Invalid credentials");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

// ── POST /api/v1/users/logout ────────────────────────────────────────────────
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// ── POST /api/v1/users/refresh-token ────────────────────────────────────────
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.JWT_REFRESH_SECRET
        );
        const user = await User.findById(decodedToken?._id);

        if (!user) throw new ApiError(401, "Invalid refresh token");
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or already used");
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        };

        const { accessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed successfully"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

// ── GET /api/v1/users/me ─────────────────────────────────────────────────────
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

export { registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser };
