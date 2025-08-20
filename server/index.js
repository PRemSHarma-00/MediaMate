const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();

app.use(cors(
  {
    origin: "https://media-mate.vercel.app/",
    methods: ["GET", "POST"],
    credentials: true
  }
));
app.use(express.json());


const suggestRoutes = require("./path/suggest");
app.use("/api/suggest", suggestRoutes); 

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
