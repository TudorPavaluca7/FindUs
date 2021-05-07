const Post = require("../models/post");
const Notification = require("../models/notification");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.postById = async (req, res, next, id) => {
  const post = await Post.findById(id)
    .populate("postedBy", "_id firstName lastName")
    .populate("comments", "text created")
    .populate("comments.postedBy", "_id firstName lastName");
  if (!post)
    return res.status(400).json({
      error: "Post not found",
    });

  req.post = post; // adds post object in req with user info
  //console.log(req);
  next();
};

// exports.updatePost = (req, res, next) => {
//   let post = req.post;
//   post = _.extend(post, req.body);
//   post.updated = Date.now();
//   post.save((err) => {
//     if (err) {
//       return res.status(400).json({
//         error: err,
//       });
//     }
//     res.json(post);
//   });
// };

exports.updatePost = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
      if (err) {
          return res.status(400).json({
              error: 'Photo could not be uploaded'
          });
      }
      let post = req.post;
      post = _.extend(post, fields);
      post.updated = Date.now();

      if (files.photo) {
          post.photo.data = fs.readFileSync(files.photo.path);
          post.photo.contentType = files.photo.type;
      }

      post.save((err, result) => {
          if (err) {
              return res.status(400).json({
                  error: err
              });
          }
          res.json(post);
      });
  });
};


exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("postedBy", "_id firstName lastName followers")
      .populate("comments", "text created")
      .populate("comments.postedBy", "_id firstName lastName")
      .select("_id content photo created likes")
      .sort({ created: -1 });
    res.json(posts);
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

exports.getValidPosts = async (req, res) => {
  
  let following = req.profile.following;
  
  try {
    const posts = await Post.find({$or: [{postedBy: req.profile._id}, {postedBy: { $in: following }}]})
      .populate("postedBy", "_id firstName lastName followers")
      .populate("comments", "text created")
      .populate("comments.postedBy", "_id firstName lastName")
      .select("_id content photo created likes")
      .sort({ created: -1 });
    res.json(posts);
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

//parse method parse the fields and the files
exports.createPost = (req, res) => {
  let form = new formidable.IncomingForm(); //for parsing form data, especially file uploads.
  form.keepExtensions = true; //include the extensions of the original files (.jpf, .png)

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    let post = new Post(fields);

    req.profile.password = undefined;

    post.postedBy = req.profile;

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(result);
    });
  });
};

exports.postsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.profile._id })
      .populate("postedBy", "_id firstName lastName followers")
      .populate("comments", "text created")
      .populate("comments.postedBy", "_id firstName lastName")
      .select("_id content photo created likes")
      .sort({ created: -1 }); //.select("_id title body")
    res.json(posts);
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

// exports.isPoster = (req, res, next) => {
//   let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;

//   if (!isPoster) {
//     return res.status(403).json({
//       error: "User is not authorized",
//     });
//   }
//   next();
// };

exports.deletePost = async (req, res) => {
  let post = req.post;
  try {
    await post.remove();
    await Notification.deleteMany({post:post._id})
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

exports.getPost = (req, res) => {
  return res.json(req.post);
};

exports.photo = (req, res, next) => {
  res.set("Content-Type", req.post.photo.contentType);
  return res.send(req.post.photo.data);
};

exports.like = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { likes: req.body.userId } },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    } else {
      res.json(result);
    }
  });
};

exports.unlike = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { likes: req.body.userId } },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    } else {
      res.json(result);
    }
  });
};

exports.comment = (req, res) => {
  let comment = req.body.comment;
  comment.postedBy = req.body.userId;

  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments: comment } },
    { new: true }
  )
    .populate("comments.postedBy", "_id firstName lastName")
    .populate("postedBy", "_id firstName lastName")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      } else {
        res.json(result);
      }
    });
};

exports.uncomment = (req, res) => {
  let comment = req.body.comment;

  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { comments: { _id: comment._id } } },
    { new: true }
  )
    .populate("comments.postedBy", "_id firstName lastName")
    .populate("postedBy", "_id firstName lastName")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      } else {
        res.json(result);
      }
    });
};
