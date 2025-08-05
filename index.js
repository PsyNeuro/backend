// backend/index.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Import cookie-parser
const RedisAdapter = require("./models/RedisAdapter");
const MongoDBAdaptor = require("./models/MongoDBAdaptor");

require("dotenv").config();
const app = express();

app.use(
  // CORS, cross origin resource sharing, allows the frontend and backend servers to share resources despite being on different ports
  cors({
    origin: "http://localhost:3000", // **Replace with your actual frontend URL**
    credentials: true, // This is crucial for cookies
  })
);

app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware

// Use Redis client from RedisAdapter
const redisAdapter = new RedisAdapter();
const client = redisAdapter.client;

client
  .ping()
  .then((pong) => {
    if (pong === "PONG") {
      console.log("Session middleware enabled: Redis is ready.");

      // Connect to MongoDB
      const mongoDBAdaptor = new MongoDBAdaptor();

      // Register routes AFTER session middleware
      app.use("/api/hello", require("./routes/hello.js"));
      app.use("/api/register", require("./routes/register.js"));
      app.use("/api/user", require("./routes/users.js"));
      app.use("/api/login", require("./routes/login.js"));
      app.use("/api/logout", require("./routes/logout.js"));
      app.use("/api/me", require("./routes/me.js"));
      app.use("/api/protected", require("./routes/protected.js"));
      app.use("/api/isteacher", require("./routes/isteacher.js"));
      app.use("/api/lectureset", require("./routes/addlecture.js"));

      // Start server AFTER everything is ready
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } else {
      console.error(
        "Redis did not respond with PONG. Session middleware not enabled."
      );
    }
  })
  .catch((err) => {
    console.error("Redis ping failed:", err);
  });
