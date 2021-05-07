const _ = require("lodash");
const User = require("../models/user");
const Post = require("../models/user");
const Notification = require("../models/user");
const Location = require("../models/location");
const formidable = require("formidable");
const fs = require("fs");
const { comment } = require("./post");

exports.userById = async (req, res, next, id) => {
  const user = await User.findById(id)
    .populate("following", "_id firstName lastName")
    .populate("followers", "_id firstName lastName");
  if (!user)
    return res.status(400).json({
      error: "User not found",
    });

  req.profile = user; // adds profile object in req with user info
  //console.log(req);
  next();
};

exports.userById = (req, res, next, id) => {
  User.findById(id)
    // populate followers and following users array
    .populate("following", "_id firstName lastName")
    .populate("followers", "_id firstName lastName")
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      req.profile = user; // adds profile object in req with user info

      next();
    });
};

exports.hasAuthorization = (req, res, next) => {
  if (req.profile && req.auth && req.profile._id !== req.auth._id) {
    return res.status(403).json({
      error: "User is not authorized to perform this action",
    });
  }
};

exports.allUsers = async (req, res) => {
  try {
    const users = await User.find({
      location: req.profile.location,
      homeland: req.profile.homeland,
    }).select("firstName lastName");

    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

exports.getUser = (req, res) => {
  req.profile.hashed_password = undefined;

  return res.json(req.profile);
};

// exports.updateUser = async (req, res, next) => {
//   let user = req.profile;
//   console.log(user);
//   user = lodash.extend(user, req.body); // extend - mutate the source object, updateaza user in functie de ce se afla in req body
//   console.log(user);
//   user.updated = Date.now();
//   try {
//     await user.save();
//     user.hashed_password = undefined;
//     res.json({ user });
//   } catch (err) {
//     return res.status(400).json({
//       error: "You are not authorized to perform this action",
//     });
//   }
// };

exports.updateUser = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    // save user
    let user = req.profile;
    user = _.extend(user, fields);
    user.updated = Date.now();

    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      user.hashed_password = undefined;

      res.json(user);
    });
  });
};

exports.deleteUser = async (req, res, next) => {
  let user = req.profile;
  try {
    await user.remove();
    await Post.deleteMany({postedBy:user._id});
    await Notification.deleteMany({loggedUser:user._id});
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

exports.userPhoto = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set(("Content-Type", req.profile.photo.contentType));
    return res.send(req.profile.photo.data);
  }
  next();
};

exports.addFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    { $push: { following: req.body.followId } },
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      next();
    }
  );
};

exports.addFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    { $push: { followers: req.body.userId } },
    { new: true } //mongo db will return the old data not the updated data if we don't use that
  )
    .populate("following", "_id firstName lastName")
    .populate("followers", "_id firstName lastName")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      result.hashed_password = undefined;

      res.json(result);
    });
};

exports.removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    { $pull: { following: req.body.unfollowId } },
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      next();
    }
  );
};

exports.removeFollower = (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    { $pull: { followers: req.body.userId } },
    { new: true }
  )
    .populate("following", "_id firstName lastName")
    .populate("followers", "_id firstName lastName")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      result.hashed_password = undefined;

      res.json(result);
    });
};

exports.findPeople = async (req, res) => {
  let following = req.profile.following;
  following.push(req.profile._id);

  try {
    const users = await User.find({
      _id: { $nin: following },
      location: req.profile.location,
      homeland: req.profile.homeland,
    }).select("firstName lastName location");
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

// exports.addNotification = (req, res) => {

//   let notification = req.body.action_type;
//   notification.created = req.body.loggedUserId;
//   // notification.post = req.body.postId;
//   console.log(notification)
//   User.findByIdAndUpdate(
//     req.body.userId,
//     { $push: { notifications: notification}},
//     { new: true } //mongo db will return the old data not the updated data if we don't use that
//   )
//     .populate("notifications.created", "_id firstName lastName")
//     .populate("notifications.post", "_id ")
//     .exec((err, result) => {
//       if (err) {
//         return res.status(400).json({
//           error: err,
//         });
//       }
//       result.hashed_password = undefined;

//       res.json(result);
//     });
// };

// exports.removeNotifications = (req, res) => {
//   const userId = req.params.userId;
//   User.findByIdAndUpdate(userId, { $pullAll: notifications }, { new: true })
//     .populate("notifications.created", "_id firstName lastName")
//     .populate("notifications.post", "_id ")
//     .exec((err, result) => {
//       if (err) {
//         return res.status(400).json({
//           error: err,
//         });
//       }
//       result.hashed_password = undefined;

//       res.json(result);
//     });
// };

// exports.getNotifications = async (req, res) => {
//   const userId = req.params.userId;

//   try {
//     const user = await User.find({
//       _id: userId,
//     })
//       .select("notifications")
//       .populate("notifications.created", "_id firstName lastName")
//       .populate("notifications.post", "_id ");
//     res.json(user);
//   } catch (err) {
//     return res.status(400).json({
//       error: err,
//     });
//   }
// };
