const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  // console.log("Hello endpoint reached via router");
  res.status(200).json({
    message: "Hello from backend!",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
