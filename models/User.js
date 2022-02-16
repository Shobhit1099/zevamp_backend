const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Email: { type: String, required: true },
  Name: { type: String, required: true },
  Phone_Number: { type: Number, required: true },
  Spend_days: { type: String, required: false },
  Meet_Stranger: { type: String, required: false },
  Centre_Of_Attraction: { type: String, required: false },
  Discipline: { type: Number, required: false },
});
const User = new mongoose.model("User", userSchema);

module.exports = User;
