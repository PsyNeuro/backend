const verifyAuthTokenR = require("../functions/verifyAuthTokenR");
const router = require("./users");

router.get("/api/protected", verifyAuthTokenR, (req, res) => {
  res.status(200).send("You are in!");
});

module.exports = router;
