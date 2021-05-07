const express = require("express");
const { signup, signin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const validator = require("../validator/authValidator");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
// any route containing :userId, our app will first execute userByID()
router.param("userId", userById);

module.exports = router;
