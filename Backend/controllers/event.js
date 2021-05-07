const Event = require("../models/event");
const User = require("../models/user");

exports.eventById = async (req, res, next, id) => {
  const event = await Event.findById(id)
    .populate("members", "_id firstName lastName")
    .populate("owner", "_id firstName lastName");
  if (!event)
    return res.status(400).json({
      error: "Event not found",
    });

  req.event = event; // adds post object in req with user info
  //console.log(req);
  next();
};

exports.getEvents = async (req, res) => {
  const userId = req.params.userId;
  try {
    const events = await Event.find({ owner: { $ne: userId } })
      .populate("members", "_id firstName lastName")
      .populate("owner", "_id firstName lastName")
      .select("_id name location day time description");
    res.json(events);
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

exports.getEvent = async (req, res) => {
  const eventId = req.params.eventId;

  const event = await Event.findById(eventId);

  return res.json(event);
};

exports.createEvent = async (req, res) => {
  const event = new Event(req.body.event);
  event.owner = await User.findById(req.body.ownerId);
  event.save().then((result) => {
    res.json({
      event: result,
    });
  });
};

exports.addMember = (req, res) => {
  Event.findByIdAndUpdate(
    req.body.eventId,
    { $push: { members: req.body.memberId } },
    { new: true }
  )
    .populate("members", "_id firstName lastName")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }

      res.json(result);
    });
};

exports.updateEvent = (req, res) => {
  const eventId = req.params.eventId;
 
  Event.findByIdAndUpdate(eventId, req.body.event).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    res.json(result);
  });
};

exports.removeMember = (req, res) => {
  Event.findByIdAndUpdate(
    req.body.eventId,
    { $pull: { members: req.body.memberId } },
    { new: true }
  )
    .populate("members", "_id firstName lastName")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      

      res.json(result);
    });
};

exports.deleteEvent = async (req, res) => {
  const eventId = req.params.eventId;
  try {
    await Event.findByIdAndDelete(eventId);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

exports.userEvents = async (req, res) => {
  const userId = req.params.userId;
  try {
    const events = await Event.find({ owner: userId })
      .populate("members", "_id firstName lastName")
      .populate("owner", "_id firstName lastName")
      .select("_id name location day time description");
    res.json(events);
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};
