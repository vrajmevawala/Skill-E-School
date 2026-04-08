import express, { Application } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middlewares/error-handler";
import authRoutes from "./modules/auth/auth.routes";
import coursesRoutes from "./modules/courses/courses.routes";
import webinarRoutes from "./modules/webinars/webinars.routes";
import franchiseRoutes from "./modules/franchise/franchise.routes";
import consultancyRoutes from "./modules/consultancy/consultancy.routes";
import booksRoutes from "./modules/books/books.routes";

const app: Application = express();

// Standard Middlewares
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../../dist");

app.use(express.static(distPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        // Log sensitive info masked
        const body = { ...req.body };
        if (body.password) body.password = "********";
        console.log("Body:", JSON.stringify(body, null, 2));
    }
    next();
});

// Routes
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "success", data: { message: "Server is healthy" } });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/webinars", webinarRoutes);
app.use("/api/franchise", franchiseRoutes);
app.use("/api/consultancy", consultancyRoutes);
app.use("/api/books", booksRoutes);

// Error Handling
app.use(errorHandler);

// Serve index.html for all other routes (SPA support)
app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});

export default app;
