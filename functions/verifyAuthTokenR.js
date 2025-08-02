const RedisAdapter = require("../models/RedisAdapter");
const redisCache = new RedisAdapter();

async function verifyAuthTokenR(req, res, next) {
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
}

module.exports = verifyAuthTokenR;
