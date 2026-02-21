import mongoose from 'mongoose';
import { Notice } from './src/models/notice.models.js';
import { Event } from './src/models/event.models.js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lbs_school_db";

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to seed data...");

        // Clear existing
        await Notice.deleteMany({});
        await Event.deleteMany({});

        // Seed Notices
        const notices = [
            {
                title: "Annual Sports Meet 2024",
                content: "The annual sports meet will be held on Oct 25th. All students must wear their house uniforms.",
                category: "event",
                targetAudience: "all",
                isPinned: true,
                publishedAt: new Date(),
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            },
            {
                title: "Quarterly Exams Schedule",
                content: "Exams for classes I-X starting from Nov 2nd. Check the Academics section for detailed timetable.",
                category: "exam",
                targetAudience: "students",
                isPinned: false,
                publishedAt: new Date(),
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
            },
            {
                title: "School Holiday - Diwali",
                content: "The school will remain closed from Oct 31st to Nov 4th on account of Diwali celebrations.",
                category: "holiday",
                targetAudience: "all",
                isPinned: true,
                publishedAt: new Date(),
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
            },
            {
                title: "Science Exhibition Registration",
                content: "Students interested in participating in the Science Innovation Fair must register by Oct 18th.",
                category: "academic",
                targetAudience: "students",
                isPinned: false,
                publishedAt: new Date(),
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
            }
        ];

        // Seed Events
        const events = [
            {
                title: "Annual Science Innovation Fair",
                description: "A showcase of innovative projects by our students across all wings.",
                category: "academic",
                startDate: new Date("2024-10-15T09:00:00"),
                endDate: new Date("2024-10-15T16:00:00"),
                venue: "School Auditorium & Open Ground",
                time: "9:00 AM - 4:00 PM",
                status: "upcoming",
                totalSeats: 200,
                registeredCount: 145,
            },
            {
                title: "Inter-School Sports Championship",
                description: "State level sports championship specifically for track and field events.",
                category: "sports",
                startDate: new Date("2024-11-02T08:00:00"),
                endDate: new Date("2024-11-04T17:00:00"),
                venue: "City Sports Complex",
                time: "8:00 AM - 5:00 PM",
                status: "upcoming",
                totalSeats: 100,
                registeredCount: 78,
            },
            {
                title: "Cultural Heritage Fest 2024",
                description: "Celebrating diversity through art, music, and dance performances.",
                category: "cultural",
                startDate: new Date("2024-11-18T10:00:00"),
                endDate: new Date("2024-11-18T20:00:00"),
                venue: "Main Campus Stage",
                time: "10:00 AM - 8:00 PM",
                status: "upcoming",
                totalSeats: 500,
                registeredCount: 320,
            }
        ];

        await Notice.insertMany(notices);
        await Event.insertMany(events);

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding data:", err);
        process.exit(1);
    }
}

seed();
