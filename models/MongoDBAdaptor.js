const mongoose = require("mongoose");
const User = require("./User");
const bcryptjs = require("bcryptjs");

class MongoDBAdaptor {
  constructor() {
    mongoose
      .connect(
        process.env.MONGODB_URI ||
          "mongodb://localhost:27017/student_uni_system"
      )
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.error("MongoDB connection error:", err));
  }

  async login(email, password) {
    const user = await User.findOne({ email: email });

    if (!user) {
      return { error: "User not found" };
    }
    console.log("Found user:", {
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Compare password with hashed password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return { error: "Invalid password" };
    }
    console.log("User: " + user.name + " logged in successfully");
    return user;
  }

  async register(name, email, password, role) {
    try {
      // Validate required fields
      if (!name || !email || !password || !role) {
        return {
          error:
            "Missing required fields. Name, email, and password are required.",
        };
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
        return {
          error:
            "Email address is already associated with an account, can't register.",
        };
      }

      console.log("Email is available for registration");

      // Hash the password before saving
      const hashedPassword = await bcryptjs.hash(password, 10);

      const user = new User({ name, email, password: hashedPassword, role });
      await user.save();

      return {
        message: "User registered successfully",
        user: { name, email, role },
      };
    } catch (error) {
      console.error("Registration error:", error);
      return { error: error.message };
    }
  }

  async getDetails(email) {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return { error: "User not found" };
      }
      return user;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return { error: error.message };
    }
  }
}

module.exports = MongoDBAdaptor;
