const express = require("express");
const { registerUser, loginUser, currentUser, getUser } = require("../controllers/userController");
const { validateToken, validateAdminToken } = require("../middleware/validateTokenHandler");
const router = express.Router();

router.route("/user/register").post(registerUser);

router.route("/user/login").post(loginUser);

router.route("/user/current").get(validateToken, currentUser);

router.route("/user").get(getUser);

module.exports = router;