const Notification = require("../models/notification");
const User = require("../models/user");
const Post = require("../models/post");

exports.addNotification = async (req, res) => {
 
  const action_type = req.body.action_type;
  const user = await User.findById(req.body.userId);
  const loggedUser = await User.findById(req.body.loggedUserId);
  const post = await Post.findById(req.body.postId);
  const notification = new Notification({
    action_type: action_type,
    loggedUser: loggedUser,
    user: user,
    post: post,
  });
  notification.save().then((result) => {
    res.json({
      notification: result,
    });
  });
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({user: req.profile._id})
      .select("_id action_type")
      .populate("user", "_id")
      .populate("loggedUser", "_id firstName lastName")
      .populate("post", "_id"); 
    res.json(notifications);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: err,
    });
  }
};


exports.removeNotificationsByUserId = async (req, res) => {
  
    const userId = req.params.userId;
    try {
      await Notification.deleteMany({user:userId});
      res.json({ message: "Notification deleted successfully" });
    } catch (err) {
      return res.status(400).json({
        error: err,
      });
    }
  
     
}

