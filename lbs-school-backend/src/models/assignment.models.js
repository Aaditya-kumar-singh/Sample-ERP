import mongoose, { Schema } from "mongoose";

const assignmentSchema = new Schema(
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
        dueDate: {
            type: Date,
            required: true,
        },
        classRef: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        section: {
            type: String,
            required: true,
        },
        subject: {
            type: Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        attachments: [
            {
                url: String, // could be cloudinary URL or similar
                name: String
            }
        ]
    },
    { timestamps: true }
);

export const Assignment = mongoose.model("Assignment", assignmentSchema);
