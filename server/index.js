const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({ 
  origin: ["https://media-mate.vercel.app"],  // no trailing slash
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// ✅ Test root route
app.get("/", (req, res) => {
  res.send("✅ Backend is running on Render!");
});

// Your suggest route
const suggestRoutes = require("./path/suggest");
app.use("/api/suggest", suggestRoutes);

// ✅ Use Render's dynamic port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
