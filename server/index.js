const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Allow deployed frontend + local dev
const allowedOrigins = [
  "https://media-mate.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Health-check / keep-alive route (ping this to prevent Render cold starts)
app.get("/", (req, res) => {
  res.send("✅ Backend is running on Render!");
});

// Suggest route
const suggestRoutes = require("./path/suggest");
app.use("/api/suggest", suggestRoutes);

// ✅ Use Render's dynamic port
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
