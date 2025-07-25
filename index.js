// backend/index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const secret = process.env.JWT_SECRET || "thisshouldbeasecret"; // env variable
function verifyAuthToken(req, res, next) {
  // Get token from Authorization header (Bearer token) or cookies
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : req.cookies?.authToken;

  if (!token) {
    return res.status(401).json({
      message: "No token provided. Authentication failed!",
    });
  }

  // verify the token
  jwt.verify(token, secret, function (err, decoded) {
    if (err) {
      return res.status(401).json({
        message: "Invalid token. Authentication failed! Please try again :(",
      });
    }

    // save to request object for later use
    req.userId = decoded.id;
    next();
  });
}

const PORT = process.env.PORT || 5000;

// Simple MongoDB connection for Docker
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/student_uni_system"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Simple User model (no separate files needed yet)
const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
  role: String,
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// Simple user registration endpoint
app.post("/api/register", async (req, res) => {
  try {
    // Gets user data from frontend
    console.log("Register Endpoint Reached");
    console.log("Request body:", req.body);

    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error:
          "Missing required fields. Name, email, and password are required.",
      });
    }

    console.log("Extracted data:", { name, email, password: "***", role });

    // Check if email exists
    console.log("Checking if email has been used:", email);

    const check_user = await User.findOne({ email: email });

    if (check_user) {
      console.log("Email already exists for user:", {
        name: check_user.name,
        email: check_user.email,
        role: check_user.role,
      });
      return res.status(409).json({
        error:
          "Email address is already associated with an account, can't register.",
      });
    }

    console.log("Email is available for registration");

    // Hash the password before saving
    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.json({
      message: "User registered successfully",
      user: { name, email, role },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Get all users
app.get("/api/users", async (req, res) => {
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

// Login endpoint
app.post("/api/login", async (req, res) => {
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

    // Create JWT token
    const token = jwt.sign({ id: user._id }, secret, {
      expiresIn: 86400, // expires in 24 hours
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

app.get("/api/protected", verifyAuthToken, (req, res) => {
  res.status(200).send("You are in!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
