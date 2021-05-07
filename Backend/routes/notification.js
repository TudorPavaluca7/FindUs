const express = require("express");

const {addNotification, getNotifications, removeNotificationsByUserId} = require("../controllers/notification");
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const router = express.Router();

router.post("/addNotification", requireSignin, addNotification);
router.get("/getNotifications/:userId", requireSignin, getNotifications);
router.delete("/removeNotificationsByUserId/:userId", removeNotificationsByUserId)

router.param("userId", userById);

module.exports = router;