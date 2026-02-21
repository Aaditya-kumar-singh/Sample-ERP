import mongoose, { Schema } from "mongoose";

const transportEventSchema = new Schema(
    {
        route: {
            type: Schema.Types.ObjectId,
            ref: "TransportRoute",
            required: true,
            index: true,
        },
        student: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
            index: true,
        },
        parentUser: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        stopName: { type: String, required: true, trim: true },
        stopOrder: { type: Number, required: true },
        eventType: {
            type: String,
            enum: [
                "pickup_arrived",
                "pickup_done",
                "drop_arrived",
                "drop_done",
            ],
            required: true,
            index: true,
        },
        eventAt: { type: Date, required: true, index: true },
        location: {
            lat: { type: Number },
            lng: { type: Number },
        },
        notes: { type: String, trim: true },
    },
    { timestamps: true }
);

transportEventSchema.index(
    { route: 1, student: 1, eventType: 1, stopOrder: 1, eventAt: 1 },
    { name: "transport_event_lookup" }
);

export const TransportEvent = mongoose.model(
    "TransportEvent",
    transportEventSchema
);
