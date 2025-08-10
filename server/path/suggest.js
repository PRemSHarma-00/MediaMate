const express = require("express");
const router = express.Router();
const { getSuggestionsFromGemini } = require("../controllers/suggestController");

router.post("/", getSuggestionsFromGemini);

module.exports = router;