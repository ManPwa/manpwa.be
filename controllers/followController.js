const asyncHandler = require("express-async-handler");
const Follow = require("../models/followModel")
const Manga = require("../models/mangaModel");


//@desc Follow manga
//@rout POST /api/manga
//@access private
const followManga = asyncHandler(async (req, res) => {
    const manga = await Manga.findOne({
        "_id": req.params.id,
        "_deleted": null
    });
    if (!manga) {
        res.status(404);
        throw new Error("Manga not found")
    }
    const following_manga = await Follow.findOne({
        "manga_id": req.params.id,
        "user_id": req.user._id,
        "_deleted": null
    });
    if (following_manga) {
        await Follow.findByIdAndUpdate(
            following_manga._id,
            {
                "is_following": !following_manga.is_following,
                "_updated": Date.now()
            }
        );
    } else {
        await Follow.create({
            "manga_id": req.params.id,
            "user_id": req.user._id
        });
    }
    res.status(201).json({
        message: "OK"
    });
});

//@desc Get following manga
//@rout GET /api/manga/follow
//@access private
const getFollowingManga = asyncHandler(async (req, res) => {
    const following_manga = await Follow.find({
        "user_id": req.user._id,
        "_deleted": null
    });
    list_manga_id = following_manga.map(f => f.manga_id);
    const manga_list = await Manga.find({
        "_id": { $in: list_manga_id },
        "_deleted": null
    });
    res.status(200).json(manga_list || {});
});

module.exports = { followManga, getFollowingManga };
