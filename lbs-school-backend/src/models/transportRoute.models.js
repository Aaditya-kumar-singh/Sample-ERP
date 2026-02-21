import mongoose, { Schema } from "mongoose";

const geoPointSchema = new Schema(
    {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    { _id: false }
);

const routeStopSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        order: { type: Number, required: true },
        location: { type: geoPointSchema, required: true },
        radiusMeters: { type: Number, default: 100 },
        pickupTime: { type: String, trim: true },
        dropTime: { type: String, trim: true },
    },
    { _id: false }
);

const assignedStudentSchema = new Schema(
    {
        student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
        parentUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
        stopOrder: { type: Number, required: true },
        stopName: { type: String, required: true, trim: true },
        isActive: { type: Boolean, default: true },
    },
    { _id: false }
);

const transportRouteSchema = new Schema(
    {
        routeCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
            index: true,
        },
        routeName: { type: String, required: true, trim: true },
        busNumber: { type: String, required: true, trim: true },
        schoolLocation: { type: geoPointSchema, required: true },
        driver: {
            name: { type: String, required: true, trim: true },
            phone: { type: String, required: true, trim: true },
        },
        attendant: {
            name: { type: String, trim: true },
            phone: { type: String, trim: true },
        },
        pickupTime: { type: String, trim: true },
        dropTime: { type: String, trim: true },
        status: {
            type: String,
            enum: ["idle", "pickup", "drop", "completed", "delayed"],
            default: "idle",
        },
        currentLocation: {
            lat: { type: Number },
            lng: { type: Number },
            speedKmph: { type: Number, default: 0 },
            heading: { type: Number, default: 0 },
            accuracyMeters: { type: Number, default: 0 },
            updatedAt: { type: Date },
            etaMinutes: { type: Number },
            address: { type: String, trim: true },
        },
        stops: [routeStopSchema],
        assignedStudents: [assignedStudentSchema],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const TransportRoute = mongoose.model(
    "TransportRoute",
    transportRouteSchema
);
