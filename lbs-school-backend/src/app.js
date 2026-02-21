import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// ── Request logger ──────────────────────────────────────────
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

// ── Core middleware ──────────────────────────────────────────
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ── Routers ──────────────────────────────────────────────────
import healthcheckRouter from "./routers/healthcheck.routes.js";
import userRouter from "./routers/user.routes.js";
import studentRouter from "./routers/student.routes.js";
import admissionRouter from "./routers/admission.routes.js";
import noticeRouter from "./routers/notice.routes.js";
import eventRouter from "./routers/event.routes.js";
import newsletterRouter from "./routers/newsletter.routes.js";
import transportRouter from "./routers/transport.routes.js";
import adminRouter from "./routers/admin.routes.js";
import teacherRouter from "./routers/teacher.routes.js";
import parentRouter from "./routers/parent.routes.js";
import financeRouter from "./routers/finance.routes.js";
import examRouter from "./routers/exam.routes.js";
import attendanceRouter from "./routers/attendance.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";

// ── Routes ───────────────────────────────────────────────────
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/admissions", admissionRouter);
app.use("/api/v1/notices", noticeRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/newsletter", newsletterRouter);
app.use("/api/v1/transport", transportRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/parents", parentRouter);
app.use("/api/v1/finance", financeRouter);
app.use("/api/v1/exams", examRouter);
app.use("/api/v1/attendance", attendanceRouter);

// ── Global error handler ─────────────────────────────────────
app.use(errorHandler);

export { app };
