const express = require("express");
const {
       getPosts, 
       createPost, 
       postsByUser, 
       postById,  
       deletePost, 
       updatePost, 
       photo ,
       like, 
       unlike,
       comment,
       uncomment,
       getPost,
       getValidPosts
    } = require("../controllers/post");
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const validator = require("../validator/postValidator");

const router = express.Router();


router.get("/posts/:userId", requireSignin, getValidPosts);
//validatorul nu are sens aici, o sa incerc sa fixez asta mai incolo
router.get("/post/:postId", requireSignin, getPost);


router.put("/post/like", requireSignin, like);
router.put("/post/unlike", requireSignin, unlike);

router.put("/post/comment", requireSignin, comment);
router.put("/post/uncomment", requireSignin, uncomment);

router.post("/post/new/:userId",requireSignin ,createPost);
router.get("/posts/by/:userId", postsByUser);
router.put("/post/:postId", requireSignin, updatePost);
router.delete("/post/:postId", requireSignin, deletePost);

router.get("/post/photo/:postId", photo);

// // any route containing :postId, our app will first execute postById()
router.param("postId", postById);
// any route containing :userId, our app will first execute userById()
router.param("userId", userById);

module.exports = router;