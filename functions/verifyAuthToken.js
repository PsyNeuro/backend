const jwt = require("jsonwebtoken");
const RedisAdapter = require("../models/RedisAdapter");

const redisCache = new RedisAdapter();
const mongoDBAdaptor = new MongoDBAdaptor();
const secret = process.env.JWT_SECRET || "thisshouldbeasecret"; // env variable

async function verifyAuthToken(req, res, next) {
  //Redis session management
  const sessionID = req.cookies.session_id; // Get session ID from cookie
  const sessionData = await redisCache.get(`session:${sessionID}`); // Check if its valid

  if (!sessionData) {
    return res.status(401).json({
      message: "No active session found. Authentication failed!",
    });
  }

  req.userId = sessionData.userId; // Save user ID from session data to request object
  next();

  // JWT will be in req.cookies.jwt because of cookie-parser
  const token = req.cookies.jwt;

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

module.exports = verifyAuthToken;
