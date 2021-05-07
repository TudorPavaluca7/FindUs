const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const notificationSchema = new mongoose.Schema({
  action_type: {
    type: String,
    trim: true,
    required: true,
  },
  loggedUser: {
    type: ObjectId,
    ref: "User",
  },
  user: {
    type: ObjectId,
    ref: "User",
  },
  post: {
    type: ObjectId,
    ref: "Post",
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
