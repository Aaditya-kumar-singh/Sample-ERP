import dotenv from "dotenv";
import http from "http";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import { initSocket } from "./socket/index.js";

dotenv.config({
    path: "./.env",
});

const PORT = process.env.PORT || 8001;

connectDB()
    .then(() => {
        const server = http.createServer(app);
        initSocket(server, process.env.CORS_ORIGIN);

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });
