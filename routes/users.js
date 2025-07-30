const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    console.log("GET /api/users endpoint reached");
    const users = await User.find({}, "name email role"); // Don't return passwords
    console.log("Found users:", users);
    console.log("Number of users:", users.length);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
