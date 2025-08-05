const express = require("express");
const router = express.Router();
const isTeacher = require("../functions/isTeacher.js");

router.post("/", isTeacher, (req, res, next) => {
  console.log("POST /api/isteacher endpoint reached");
  res.json({ message: "Access granted: You are a teacher." });
});

module.exports = router;
