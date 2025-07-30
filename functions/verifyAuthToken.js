const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "thisshouldbeasecret"; // env variable

function verifyAuthToken(req, res, next) {
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
