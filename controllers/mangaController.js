const asyncHandler = require("express-async-handler");
const Follow = require("../models/followModel")
const Manga = require("../models/mangaModel");
const uuid = require("uuid");


//@desc Get all manga
//@rout GET /api/manga
//@access public
const getMangas = asyncHandler(async (req, res) => {
    const total_manga = await Manga.count({
        "_deleted": null
    });
    const manga_list = await Manga.find({
        "_deleted": null
    }).limit(24).skip((req.query.page || 0)*24);
    response = {
        "total_manga": total_manga,
        "manga_list": manga_list || []
    }
    res.status(200).json(response);
});


//@desc Get all manga
//@rout GET /api/manga
//@access public
const getManga = asyncHandler(async (req, res) => {
    const manga = await Manga.findOne({
        "_id": req.params.id,
        "_deleted": null
    });
    res.status(200).json(manga || {});
});


//@desc Create new manga
//@rout POST /api/mangas
//@access private
const createManga = asyncHandler(async (req, res) => {
    const created_manga = await Manga.create(req.body);
    res.status(201).json({ 
        message: "Create manga successful", 
        "manga_id": created_manga._id 
    });
});


//@desc Update manga
//@rout PUT /api/mangas/:id
//@access private
const updateManga = asyncHandler(async (req, res) => {
    const manga = await Manga.findById(req.params.id);
    if (!manga) {
        res.status(404);
        throw new Error("Manga not found")
    }
    if (req.file) {
        cover_art_url = req.file.path;
    };
    req.body.cover_art_url = cover_art_url;
    req.body._updated = Date.now();
    await Manga.findByIdAndUpdate(
        req.params.id,
        req.body
    );
    res.status(202).json({ 
        message: `Updated manga with id ${req.params.id}` 
    });
});

//@desc Delete manga
//@rout Delete /api/mangas/:id
//@access private
const deleteManga = asyncHandler(async (req, res) => {
    const manga = await Manga.findById(req.params.id);
    if (!manga) {
        res.status(404);
        throw new Error("Manga not found")
    }
    await Manga.findByIdAndUpdate(
        req.params.id,
        { 
            "_deleted": Date.now(),
            "_updated": Date.now()
        }
    )
    res.status(203).json({ 
        message: `Deleted manga with id ${req.params.id}` 
    });
});


//@desc Follow manga
//@rout POST /api/manga
//@access private
const followManga = asyncHandler(async (req, res) => {
    const manga = await Manga.findOne({
        "manga_id": req.params.id,
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
        const follow = await Follow.create({
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
    list_manga_id = [];
    for (var f of following_manga) {
        list_manga_id.push(f.manga_id);
    }
    const manga_list = await Manga.find({
        "_id": { $in: list_manga_id },
    });
    res.status(200).json(manga_list || {});
});

module.exports = { getMangas, getManga, createManga, updateManga, deleteManga, followManga, getFollowingManga };