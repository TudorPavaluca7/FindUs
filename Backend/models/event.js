const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  location: {
    type: String,
    trim: true,
    required: true,
  },
  day: {
    type: Date,
    default: Date.now
    
  },
  time: {
    type: String,
    trim: true
    
  },
  description: {
    type: String,
    trim: true
  },
  owner: {
    type: ObjectId,
    ref: "User"
  },
  members: [{ type: ObjectId, ref: "User" }]
});

module.exports = mongoose.model("Event", eventSchema);
