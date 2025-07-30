const express = require("express");
const app = express();
const router = express.Router();

app.post("/", async (req, res) => {
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

module.exports = router;
