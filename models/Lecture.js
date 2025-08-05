const { url } = require("inspector");
const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  duration: Number,
  teacher: String,
});

LectureSchema.methods.toJSON = function () {
  return {
    title: this.title,
    description: this.description,
    url: this.url,
    duration: this.duration,
    teacher: this.teacher,
  };
};

module.exports = mongoose.model("Lecture", LectureSchema);
// This schema defines a Lecture model with fields for title, description, date, duration, and a reference to the teacher (User model).
