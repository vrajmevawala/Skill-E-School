import express, { Application } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { errorHandler } from "./middlewares/error-handler";
import authRoutes from "./modules/auth/auth.routes";
import coursesRoutes from "./modules/courses/courses.routes";
import webinarRoutes from "./modules/webinars/webinars.routes";
import franchiseRoutes from "./modules/franchise/franchise.routes";
import consultancyRoutes from "./modules/consultancy/consultancy.routes";
import booksRoutes from "./modules/books/books.routes";

const app: Application = express();

// Diagnostic: Check for DATABASE_URL
if (process.env.DATABASE_URL) {
    const maskedUrl = process.env.DATABASE_URL.replace(/:([^@]+)@/, ":****@");
    console.log(`✅ DATABASE_URL is configured: ${maskedUrl.substring(0, 40)}...`);
} else {
    console.error("❌ [CRITICAL] DATABASE_URL is missing! Requests to the database will fail.");
}

// Standard Middlewares
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:8080",
            process.env.FRONTEND_URL,
        ].filter(Boolean);
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detailed diagnostics for dist folder
console.log("🔍 [DIAGNOSTIC] Checking for SPA files...");
console.log(`🏠 [DIAGNOSTIC] Current working directory: ${process.cwd()}`);
console.log(`📂 [DIAGNOSTIC] __dirname: ${__dirname}`);

const pathsToTry = [
    path.join(process.cwd(), "dist"),
    path.resolve(__dirname, "../../dist"),
    path.resolve(__dirname, "../dist"),
    path.join(process.cwd(), "client/dist"),
];

let distPath = pathsToTry[0];
let found = false;

for (const p of pathsToTry) {
    const indexPath = path.join(p, "index.html");
    const exists = fs.existsSync(indexPath);
    console.log(`   - Checking: ${p} -> ${exists ? "✅ Found index.html" : "❌ Not found"}`);
    if (exists && !found) {
        distPath = p;
        found = true;
    }
}

if (!found) {
    console.error("❌ [ERROR] NO index.html FOUND IN ANY SEARCH PATH!");
} else {
    console.log(`🚀 [SUCCESS] Static files will be served from: ${distPath}`);
}

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
    // If it looks like a request for a static file (contains a dot), don't serve index.html with a 200
    // This helps debug missing assets
    const isFileRequest = req.url.includes(".");
    
    if (found) {
        const absolutePath = path.resolve(distPath, "index.html");
        res.sendFile(absolutePath, (err) => {
            if (err) {
                console.error(`❌ [ERROR] Failed to send index.html from path: ${absolutePath}`);
                console.error(`   Error details: ${err.message}`);
                res.status(500).json({
                    status: "error",
                    message: "Failed to load the application from the server.",
                    path: process.env.NODE_ENV === "development" ? absolutePath : undefined
                });
            }
        });
    } else {
        res.status(isFileRequest ? 404 : 200).json({
            status: isFileRequest ? "error" : "success",
            message: isFileRequest ? `Resource not found: ${req.url}` : "Skill E-School API is running",
            timestamp: new Date().toISOString()
        });
    }
});

export default app;
