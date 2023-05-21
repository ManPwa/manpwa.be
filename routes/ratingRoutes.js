const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/validateTokenHandler");
const { ratingManga, getRatingManga, deleteRating } = require("../controllers/ratingController");


router.route("/manga/:id/rating")
    .post(validateToken, ratingManga)
    .get(validateToken, getRatingManga);

module.exports = router;