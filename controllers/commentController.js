const asyncHandler = require("express-async-handler");
const Comment = require("../models/commentModel");
const Manga = require("../models/mangaModel");


//@desc Comment manga
//@rout POST /api/manga/:id/comment
//@access private
const commentManga = asyncHandler(async (req, res) => {
    const manga = await Manga.findOne({
        "_id": req.params.id,
        "_deleted": null
    });
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
    const manga = await Manga.findOne({
        "_id": req.params.id,
        "_deleted": null
    });
    if (!manga) {
        res.status(404);
        throw new Error("Manga not found")
    }
    aggregate = [
        {
            $lookup: {
                from: "user",
                localField: "user_id",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            "$unwind": "$user"
        },
        {
            "$project": {
                "_id": 1,
                "user_id": 1,
                "manga_id": 1,
                "content": 1,
                "_deleted": 1,
                "_updated": 1,
                "_created": 1,
                "user.username": 1,
                "user.avatar_url": 1,
                "user.is_admin": 1,
            }
        },
        { 
            "$match": { 
                "_deleted": null,
                "manga_id": req.params.id 
            } 
        },
        {
            "$sort": {
                "_created": -1
            }
        }
    ];
    if (req.query.range) {
        range = JSON.parse(req.query.range)
        aggregate.push({ "$skip": range[0] });
        aggregate.push({ "$limit": (range[1] - range[0] + 1) });
    }
    const comment_list = await Comment.aggregate(aggregate);
    res.setHeader('Content-Range', `posts :0-9/${comment_list.length}`).status(200).json(comment_list);
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
