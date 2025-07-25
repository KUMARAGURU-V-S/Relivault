const express = require("express");
const dotenv = require("dotenv");
const protectedRoutes = require("./routes/protectedRoutes");

// Load environment variables from .env
dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// All routes starting with /api will go to protectedRoutes
app.use("/api", protectedRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Firebase Auth Backend Server ✅");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
