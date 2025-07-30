const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "thisshouldbeasecret"; // env variable

router.post("/", async (req, res) => {
  try {
    console.log("POST /api/login endpoint reached");
    console.log("Request body:", req.body);

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: "Missing required fields. Email and password are required.",
      });
    }

    console.log("Extracted data:", { email, password: "***" });

    // Find user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({
        error: "User not found with this email address.",
      });
    }

    console.log("Found user:", {
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Compare password with hashed password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid password.",
      });
    }

    // req.session.UserId = user._id;

    // Create JWT token
    const token = jwt.sign({ id: user._id }, secret, {
      expiresIn: "1h", // expires in 1 hour
    });

    // Set JWT as http-only cookie, which makes cookie inaccesible to client side javascript
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "Lax", // Adjust as needed: 'Strict' or 'None' (with secure:true)
      maxAge: 3600000, // 1 hour in milliseconds (matches JWT expiration)
    });

    // Login successful - return user info AND token
    res.status(200).json({
      message: "Successfully logged-in!",
      token: token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
