const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

// ✅ CORS MUST BE FIRST (VERY IMPORTANT)
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

// Error Middleware (LAST)
app.use(errorMiddleware);

module.exports = app;