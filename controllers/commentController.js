const asyncHandler = require("express-async-handler");
const Comment = require("../models/commentModel");
const Manga = require("../models/mangaModel");


//@desc Comment manga
//@rout POST /api/manga/:id/comment
//@access private
const commentManga = asyncHandler(async (req, res) => {
    const manga = await Manga.findById(req.params.id);
    if (!manga) {
        res.status(404);
        throw new Error("Manga not found")
    }
    await Comment.create({
        "manga_id": req.params.id,
        "user_id": req.user._id,
        "content": req.body.content
    });
    res.status(201).json({
        message: "OK"
    });
});

//@desc Get comment of manga
//@rout GET /api/manga/:id/comment
//@access private
const getCommentManga = asyncHandler(async (req, res) => {
    const manga = await Manga.findById(req.params.id);
    if (!manga) {
        res.status(404);
        throw new Error("Manga not found")
    }
    const comment_list = await Comment.find({
        "_deleted": null,
        "manga_id": req.params.id
    });
    res.status(200).json(comment_list || []);
});

//@desc Delete comment
//@rout Delete /api/comment/:id
//@access private
const deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
        res.status(404);
        throw new Error("Comment not found")
    }
    if (req.user._id != comment.user_id) {
        res.status(403);
        throw new Error("You are only allowed to delete your comment");
    }
    await Comment.findByIdAndUpdate(
        req.params.id,
        {
            "_deleted": Date.now(),
            "_updated": Date.now()
        }
    )
    res.status(203).json({
        message: `Deleted comment with id ${req.params.id}`
    });
});

module.exports = { commentManga, getCommentManga, deleteComment };
