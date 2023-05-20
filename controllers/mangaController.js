const asyncHandler = require("express-async-handler");
const Manga = require("../models/mangaModel");
const uuid = require("uuid");
//@desc Get all mangas
//@rout GET /api/mangas
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

//@desc Get all mangas
//@rout GET /api/mangas
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
//@access public
const createManga = asyncHandler(async (req, res) => {
    const created_manga = await Manga.create(req.body);
    res.status(201).json({ 
        message: "Create manga successful", 
        "manga_id": created_manga._id 
    });
});

//@desc Update manga
//@rout PUT /api/mangas/:id
//@access public
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
//@access public
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

module.exports = { getMangas, getManga, createManga, updateManga, deleteManga };