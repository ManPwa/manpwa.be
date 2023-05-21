const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/validateTokenHandler");
const { followManga, getFollowingManga } = require("../controllers/followController");


router.route("/manga/:id/follow").post(validateToken, followManga);

router.route("/following-manga").get(validateToken, getFollowingManga);

module.exports = router;