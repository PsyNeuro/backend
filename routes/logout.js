const express = require("express");
const router = express.Router();
const RedisAdapter = require("../models/RedisAdapter");
const redisAdapter = new RedisAdapter();

router.post("/", async (req, res) => {
  try {
    console.log("POST /api/logout endpoint reached");
    const sessionId = req.cookies.session_id;
    if (sessionId) {
      try {
        await redisAdapter.del(sessionId); // Remove session from Redis
        res.clearCookie("session_id", { httpOnly: true, sameSite: "lax" }); // Remove cookie
        console.log(`Session ${sessionId} cleared and cookie removed.`);
      } catch (redisErr) {
        console.error(
          `Error clearing session ${sessionId} from Redis:`,
          redisErr
        );
        return res
          .status(500)
          .json({ error: "Failed to clear session from Redis." });
      }
    } else {
      console.warn("No session_id cookie found during logout.");
    }
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed due to server error." });
  }
});

module.exports = router;
