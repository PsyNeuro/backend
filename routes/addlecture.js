const express = require("express");
const router = express.Router();
const mongoDBAdaptor = require("../models/MongoDBAdaptor");
mongoDBAdaptor_ = new mongoDBAdaptor();

router.post("/", async (req, res) => {
  try {
    // Gets user data from frontend
    console.log("Add Lecture Endpoint Reached");
    console.log("Request body:", req.body);

    const { title, description, url, duration, teacher } = req.body;
    const result = await mongoDBAdaptor_.addLecture(
      title,
      description,
      url,
      duration,
      teacher
    );

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    return res.json(result);
  } catch (error) {
    console.error("Add Lecture error:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
