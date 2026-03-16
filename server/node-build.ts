import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { createServer } from "./index";
import { prisma } from "./lib/prisma";

const app = createServer();
const port = process.env.PORT || 3000;

// In production, serve the built SPA files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../spa");

// Serve static files
app.use(express.static(distPath));

// Handle React Router - serve index.html for all non-API routes
/*
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  const indexPath = path.resolve(distPath, "index.html");
  res.sendFile(indexPath);
});
*/

const server = app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`🛑 Received ${signal}, shutting down gracefully`);

  server.close(() => {
    console.log("HTTP server closed");
  });

  // Disconnect Prisma
  await prisma.$disconnect();
  console.log("Database connection closed");

  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
