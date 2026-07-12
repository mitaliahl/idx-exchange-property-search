const express = require("express");
const cors = require("cors");
require("dotenv").config();


const pool = require("./db/pool");

const app = express();

app.use(cors());
app.use(express.json());

// Logs method, URL, status code, and response time for every request
app.use((req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
});

//Allows the server to now handle requests to the route /api/properties
const propertiesRouter = require("./routes/properties");
app.use("/api/properties", propertiesRouter);

app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS result");

    res.json({
      status: "ok",
      database: rows[0].result === 1 ? "connected" : "unknown",
    });
  } catch (error) {
    console.error("Database health check failed:", error.message);

    res.status(500).json({
      status: "error",
      database: "disconnected",
      message: "Database connection failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});