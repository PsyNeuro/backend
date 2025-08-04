const express = require("express");
const router = express.Router();
const mongoDBAdaptor = require("../models/MongoDBAdaptor");
mongoDBAdaptor_ = new mongoDBAdaptor();

router.post("/", async (req, res) => {
  try {
    // Gets user data from frontend
    console.log("Register Endpoint Reached");
    console.log("Request body:", req.body);

    const { name, email, password, role } = req.body;
    const result = await mongoDBAdaptor_.register(name, email, password, role);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    return res.json(result);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
