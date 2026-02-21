import mongoose, { Schema } from "mongoose";

const studyMaterialSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        materialType: {
            type: String,
            enum: ["pdf", "video", "document", "link", "other"],
            required: true,
        },
        fileUrl: {
            type: String,
            required: true, // URL from cloudinary or similar
        },
        classRef: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        subject: {
            type: Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },
        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: "User", // Teacher who uploaded
            required: true,
        },
    },
    { timestamps: true }
);

export const StudyMaterial = mongoose.model("StudyMaterial", studyMaterialSchema);
