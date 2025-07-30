// backend/index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser"); // Import cookie-parser

const register = require("./routes/register.js");
const hello = require("./routes/hello.js");
const users = require("./routes/users.js");
const login = require("./routes/login.js");
const me = require("./routes/me.js");
const protected = require("./routes/protected.js");

const session = require("express-session");
const redis = require("redis");
const RedisStore = require("connect-redis");

// app.get("/setSessionData", async function (req, res) {
//   const { email } = req.body;
//   const user = await User.findOne({ email: email });

//   if (user) {
//     req.session.userID = user._id;
//     res.send("Session data set!");
//   } else {
//     res.status(404).send("User not found");
//   }
// });

// app.get("/getSessionData", function (req, res) {
//   res.send("MongoID: " + req.session.userID);
// });

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

// Redis stuff

// const redis = require("redis");
// const client = redis.createClient({
//   host: "localhost",
//   port: "6000",
// });

// // Handle Redis client connection errors
// client.on("connect", () => console.log("Connected to Redis!"));
// client.on("error", (err) => console.log("Redis Client Error", err));

// Create Redis client using Docker Compose env vars or defaults
const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6000,
  },
});

// Use RedisStore for session storage
app.use(
  session({
    store: new RedisStore({ client }),
    secret: "mysecret", // Change to your secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Connect to Redis server
client.connect().catch(console.error);

// app.use(
//   session({
//     store: new RedisStore({ client: client }),
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// JWT secret
const secret = process.env.JWT_SECRET || "thisshouldbeasecret"; // env variable

const PORT = process.env.PORT || 5000;

// Simple MongoDB connection for Docker
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/student_uni_system"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/hello", hello);
app.use("/api/register", register);
app.use("/api/user", users);
app.use("/api/login", login);
app.use("/api/me", me);
app.use("/api/protected", protected);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
