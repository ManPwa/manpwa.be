const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/validateTokenHandler");
const { followManga, getFollowingManga, getFollow } = require("../controllers/followController");


router.route("/manga/:id/follow").post(validateToken, followManga).get(validateToken, getFollow);

router.route("/following-manga").get(validateToken, getFollowingManga);

module.exports = router;