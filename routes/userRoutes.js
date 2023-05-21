const express = require("express");
const { registerUser, loginUser, currentUser } = require("../controllers/userController");
const { validateToken, validateAdminToken } = require("../middleware/validateTokenHandler");
const router = express.Router();

router.route("/user/register").post(registerUser);

router.route("/user/login").post(loginUser);

router.route("/user/current").get(validateToken, currentUser);

module.exports = router;