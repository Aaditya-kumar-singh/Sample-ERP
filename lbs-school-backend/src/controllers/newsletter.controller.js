import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Newsletter } from "../models/newsletter.models.js";

const subscribe = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
        if (existing.isActive) {
            return res
                .status(200)
                .json(new ApiResponse(200, existing, "You are already subscribed!"));
        } else {
            existing.isActive = true;
            await existing.save();
            return res
                .status(200)
                .json(new ApiResponse(200, existing, "Subscription reactivated!"));
        }
    }

    const subscription = await Newsletter.create({ email });

    return res
        .status(201)
        .json(new ApiResponse(201, subscription, "Subscribed successfully!"));
});

const getAllSubscribers = asyncHandler(async (req, res) => {
    const subscribers = await Newsletter.find({ isActive: true }).select("email createdAt");
    return res
        .status(200)
        .json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"));
});

export { subscribe, getAllSubscribers };
