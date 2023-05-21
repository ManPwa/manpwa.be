const asyncHandler = require("express-async-handler");
const Rating = require("../models/ratingModel");
const Manga = require("../models/mangaModel");


//@desc Comment manga
//@rout POST /api/manga/:id/comment
//@access private
const ratingManga = asyncHandler(async (req, res) => {
    if (isNaN(req.body.rating)) {
        res.status(403);
        throw new Error("Rating must be a number")
    }
    const manga = await Manga.findOne({
        "_id": req.params.id,
        "_deleted": null
    });
    if (!manga) {
        res.status(404);
        throw new Error("Manga not found")
    }
    const rating = await Rating.findOne({
        "manga_id": req.params.id,
        "user_id": req.user._id,
        "_deleted": null,
    });
    if (rating) {
        await Rating.findByIdAndUpdate(
            rating._id,
            {
                "rating": req.body.rating,
            }
        )
    } else {
        await Rating.create({
            "manga_id": req.params.id,
            "user_id": req.user._id,
            "rating": req.body.rating
        });
    }
    res.status(201).json({
        message: "OK"
    });
});

//@desc Get comment of manga
//@rout GET /api/manga/:id/comment
//@access private
const getRatingManga = asyncHandler(async (req, res) => {
    const rating = await Rating.findOne({
        "_deleted": null,
        "user_id": req.user._id,
        "manga_id": req.params.id
    });
    res.status(200).json(rating || []);
});

module.exports = { ratingManga, getRatingManga };
