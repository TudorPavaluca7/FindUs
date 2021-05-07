const express = require("express");

const {
  getEvents,
  createEvent,
  addMember,
  removeMember,
  userEvents,
  deleteEvent,
  getEvent,
  updateEvent,
} = require("../controllers/event");
const { requireSignin } = require("../controllers/auth");

const router = express.Router();



router.put("/event/add", requireSignin, addMember);
router.put("/event/remove", requireSignin, removeMember);

router.get("/events/:userId", requireSignin, getEvents);
router.get("/event/:eventId", requireSignin, getEvent )
router.post("/new/event", requireSignin, createEvent);

router.put("/event/:eventId", updateEvent);

router.get("/userEvents/:userId", requireSignin, userEvents);

router.delete("/delete/:eventId", requireSignin, deleteEvent);

module.exports = router;
