const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});

UserSchema.methods.toJSON = function () {
  return {
    name: this.name,
    email: this.email,
    role: this.role,
  };
};

module.exports = mongoose.model("User", UserSchema);
