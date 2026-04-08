import express, { Application } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import helmet from "helmet";
import compression from "compression";
import { errorHandler } from "./middlewares/error-handler";
import authRoutes from "./modules/auth/auth.routes";
import coursesRoutes from "./modules/courses/courses.routes";
import webinarRoutes from "./modules/webinars/webinars.routes";
import franchiseRoutes from "./modules/franchise/franchise.routes";
import consultancyRoutes from "./modules/consultancy/consultancy.routes";
import booksRoutes from "./modules/books/books.routes";

const app: Application = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Path resolution for dist folder
const pathsToTry = [
    path.join(process.cwd(), "dist"),
    path.resolve(__dirname, "../../dist"),
    path.resolve(__dirname, "../dist"),
];

let distPath = pathsToTry[0];
let found = false;

for (const p of pathsToTry) {
    if (fs.existsSync(path.join(p, "index.html"))) {
        distPath = p;
        found = true;
        break;
    }
}

// 2. Performance and Security Middlewares
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(compression());

// 3. Serve static files IMMEDIATELY (Priority #1)
// This ensures assets are never blocked by any JSON-sending middleares or CORS
if (found) {
    console.log(`🚀 [SUCCESS] Static files READY at: ${distPath}`);
    app.use(express.static(distPath, {
        index: false,
        etag: true,
        lastModified: true
    }));
} else {
    console.error("❌ [ERROR] NO index.html FOUND IN ANY SEARCH PATH!");
}

// 4. Standard Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Optimized CORS Logic
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:8080",
            process.env.FRONTEND_URL,
        ].filter(Boolean);
        
        if (!origin || allowedOrigins.includes(origin) || origin.includes("onrender.com")) {
            callback(null, true);
        } else {
            console.log(`⚠️ [CORS] Rejected origin: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

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
    // CRITICAL: If this is a request for a JS/CSS/image file that reached here, 
    // it means it was NOT found by express.static. DO NOT serve index.html.
    const isAssetRequest = req.url.includes("/assets/") || 
                          req.url.endsWith(".js") || 
                          req.url.endsWith(".css") ||
                          req.url.endsWith(".png") ||
                          req.url.endsWith(".jpg") ||
                          req.url.endsWith(".svg");
    
    if (isAssetRequest) {
        console.log(`❌ [404] Asset not found: ${req.url}`);
        return res.status(404).json({
            status: "error",
            message: `Resource not found: ${req.url}`
        });
    }

    if (found) {
        const absolutePath = path.resolve(distPath, "index.html");
        res.sendFile(absolutePath, (err) => {
            if (err) {
                console.error(`❌ [ERROR] Failed to send index.html: ${err.message}`);
                res.status(500).send("Internal Server Error (SPA Fallback failed)");
            }
        });
    } else {
        res.status(200).json({
            status: "success",
            message: "Skill E-School API is running, but UI assets are missing.",
            timestamp: new Date().toISOString()
        });
    }
});

export default app;
