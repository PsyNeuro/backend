const verifyAuthToken = require("../functions/verifyAuthToken");
const router = require("./users");

router.get("/api/protected", verifyAuthToken, (req, res) => {
  res.status(200).send("You are in!");
});

module.exports = router;
