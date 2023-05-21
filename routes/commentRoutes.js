const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/validateTokenHandler");
const { commentManga, getCommentManga, deleteComment } = require("../controllers/commentController");


router.route("/manga/:id/comment")
    .post(validateToken, commentManga)
    .get(getCommentManga);

router.route("/comment/:id")
    .delete(validateToken, deleteComment);

module.exports = router;