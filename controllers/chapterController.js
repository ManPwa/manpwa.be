const asyncHandler = require("express-async-handler");
const Chapter = require("../models/chapterModel");
const Manga = require("../models/mangaModel");
const uuid = require("uuid");
//@desc Get all chapter of a manga
//@rout GET /api/manga/:manga_id/chapter
//@access public
const getMangaChapter = asyncHandler(async (req, res) => {
    const manga = await Manga.findOne({
        "_id": req.params.id,
        "_deleted": null
    });
    if (!manga) {
        res.status(404);
        throw new Error("Manga not found")
    }
    range = JSON.parse(req.query.range)
    const total_chapter = await Chapter.count({
        "_deleted": null,
        "manga_id": req.params.id,
    });
    const chapter_list = await Chapter.find({
        "_deleted": null,
        "manga_id": req.params.id,
    }).sort({
        "chapter": -1,
    });
    res.setHeader('Content-Range', `posts : ${range[0]}-${range[1]}/${total_chapter}`).status(200).json(chapter_list);
});


//@desc Create chapter
//@rout POST /api/manga/:id/chapter
//@access public
const createChapter = asyncHandler(async (req, res) => {
    req.body.manga_id = req.params.id;
    const created_chapter = await Chapter.create(req.body);
    res.status(201).json({ 
        message: "Create chapter successful", 
        "chapter_id": created_chapter._id 
    });
});


//@desc Update chapter
//@rout PUT /api/chapter/:id
//@access public
const updateChapter = asyncHandler(async (req, res) => {
    if (req.body.manga_id) {
        res.status(403);
        throw new Error("Cannot update manga id");
    }
    const chapter = await Chapter.findOne({
        "_id": req.params.id,
        "_deleted": null,
    });
    if (!chapter) {
        res.status(404);
        throw new Error("Chapter not found");
    }
    req.body._updated = Date.now();
    await Chapter.findByIdAndUpdate(
        req.params.id,
        req.body
    );
    res.status(202).json({ 
        message: `Updated chapter with id ${req.params.id}` 
    });
});


//@desc Delete chapter
//@rout Delete /api/chapter/:id
//@access public
const deleteChapter = asyncHandler(async (req, res) => {
    const chapter = await Chapter.findOne({
        "_id": req.params.id,
        "_deleted": null,
    });
    if (!chapter) {
        res.status(404);
        throw new Error("Chapter not found")
    }
    await Chapter.findByIdAndUpdate(
        req.params.id,
        { 
            "_deleted": Date.now(),
            "_updated": Date.now()
        }
    )
    res.status(203).json({ 
        message: `Deleted chapter with id ${req.params.id}` 
    });
});

module.exports = { getMangaChapter, createChapter, updateChapter, deleteChapter };