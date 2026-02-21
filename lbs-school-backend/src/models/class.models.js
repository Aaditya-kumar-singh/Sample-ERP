import mongoose, { Schema } from "mongoose";

const classSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        sections: [
            {
                name: {
                    type: String,
                    required: true,
                    trim: true,
                },
                classTeacher: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                }
            }
        ],
        academicYear: {
            type: Schema.Types.ObjectId,
            ref: "AcademicYear",
            required: true,
        },
    },
    { timestamps: true }
);

export const Class = mongoose.model("Class", classSchema);
