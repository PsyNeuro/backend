const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const RedisAdapter = require("../models/RedisAdapter");
const MongoDBAdaptor = require("../models/MongoDBAdaptor");
const { CookieTTL, RedisTTL } = require("./Globals");

const secret = process.env.JWT_SECRET || "thisshouldbeasecret"; // env variable
const redisCache = new RedisAdapter();
const mongoDBAdaptor = new MongoDBAdaptor();

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

    mongo_user = await mongoDBAdaptor.login(email, password);

    if (mongo_user.error) {
      console.log("Login error:", mongo_user.error);
      return res.status(401).json({
        error: mongo_user.error,
      });
    }

    // Cache user session in Redis (example: cache by user email)
    await redisCache.set(
      `session:${mongo_user.email}`,
      {
        userId: mongo_user._id,
        name: mongo_user.name,
        email: mongo_user.email,
        role: mongo_user.role,
      },
      RedisTTL
    );
    console.log("Cached user session in Redis for:", mongo_user.email);

    // Set session ID in cookie
    try {
      res.cookie("session_id", email, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
      });
      // Log success or failure
      if (!req.cookies) {
        console.error("req.cookies is undefined or missing.");
      } else if (!req.cookies.session_id) {
        console.error("req.cookies exists, but session_id is missing.");
      } else {
        console.log(
          "session_id cookie set successfully:",
          req.cookies.session_id
        );
      }
    } catch (err) {
      console.error("Error setting session_id cookie:", err);
    }

    // // Create JWT token
    // const token = jwt.sign({ id: mongo_user._id }, secret, {
    //   expiresIn: "1h", // expires in 1 hour
    // });

    // // Set JWT as http-only cookie, which makes cookie inaccesible to client side javascript
    // res.cookie("jwt", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
    //   sameSite: "Lax", // Adjust as needed: 'Strict' or 'None' (with secure:true)
    //   maxAge: CookieTTL, // 1 hour in milliseconds (matches JWT expiration)
    // });

    // Login successful - return user info AND token
    res.status(200).json({
      message: "Successfully logged-in!",
      session_id: req.cookies.session_id,
      user: {
        name: mongo_user.name,
        email: mongo_user.email,
        role: mongo_user.role,
        _id: mongo_user._id,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
