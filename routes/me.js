const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    console.log("GET /api/me endpoint reached");
    sessionID = req.cookies.session_id; // Get session ID from cookie

    if (!sessionID) {
      return res.status(401).json({
        error: "No active session found. Please log in.",
      });
    }
    console.log("User ID from token:", sessionID);

    // Find user by mongodb ID which is taken from the session cookie
    const user = await User.findOne({ email: sessionID }).select("-password"); // Exclude password from response

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    console.log("Found user:", {
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Return user data
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      error: "Failed to fetch user data",
    });
  }
});

module.exports = router;
