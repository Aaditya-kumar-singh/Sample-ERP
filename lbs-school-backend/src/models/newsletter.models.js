import mongoose, { Schema } from "mongoose";

const newsletterSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Newsletter = mongoose.model("Newsletter", newsletterSchema);
