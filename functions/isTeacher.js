const axios = require("axios");

async function isTeacher(req, res, next) {
  try {
    console.log("Checking if user is a teacher..., calling api/me");

    const response = await axios.get("http://localhost:5000/api/me", {
      headers: {
        Cookie: `session_id=${req.cookies.session_id}`,
      },
    });

    if (
      response.data &&
      response.data.user &&
      response.data.user.role === "teacher"
    ) {
      console.log("User is a teacher");
      return next(); // Proceed to the next middleware or route handler
    } else if (
      response.data &&
      response.data.user &&
      response.data.user.role === "student"
    ) {
      console.error("User is a student, students cannot access this route");
      return res
        .status(403)
        .json({ message: "Forbidden: Students cannot access this route" });
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.error("Error checking user role:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = isTeacher;
