const asyncHandler = require("express-async-handler");
const Chapter = require("../models/chapterModel");
const Manga = require("../models/mangaModel");
const uuid = require("uuid");
//@desc Get all chapter of a manga
//@rout GET /api/manga/:manga_id/chapter
//@access public
const getMangaChapter = asyncHandler(async (req, res) => {
    const manga = await Manga.findById(req.params.manga_id);
    if (!manga) {
        res.status(404);
        throw new Error("Manga not found")
    }
    const chapter_list = await Chapter.find({
        "_deleted": null,
        "manga_id": req.params.manga_id,
    });
    res.status(200).json(chapter_list);
});

// //@desc Get all mangas
// //@rout GET /api/mangas
// //@access public
// const getManga = asyncHandler(async (req, res) => {
//     const manga = await Manga.findOne({
//         "_id": req.params.id,
//         "_deleted": null
//     });
//     res.status(200).json(manga || {});
// });

// //@desc Create new manga
// //@rout POST /api/mangas
// //@access public
// const createManga = asyncHandler(async (req, res) => {
//     const created_manga = await Manga.create(req.body);
//     res.status(201).json({ 
//         message: "Create manga successful", 
//         "manga_id": created_manga._id 
//     });
// });

// //@desc Update manga
// //@rout PUT /api/mangas/:id
// //@access public
// const updateManga = asyncHandler(async (req, res) => {
//     const manga = await Manga.findById(req.params.id);
//     if (!manga) {
//         res.status(404);
//         throw new Error("Manga not found")
//     }
//     req.body._updated = Date.now();
//     await Manga.findByIdAndUpdate(
//         req.params.id,
//         req.body
//     );
//     res.status(202).json({ 
//         message: `Updated manga with id ${req.params.id}` 
//     });
// });

// //@desc Delete manga
// //@rout Delete /api/mangas/:id
// //@access public
// const deleteManga = asyncHandler(async (req, res) => {
//     const manga = await Manga.findById(req.params.id);
//     if (!manga) {
//         res.status(404);
//         throw new Error("Manga not found")
//     }
//     await Manga.findByIdAndUpdate(
//         req.params.id,
//         { 
//             "_deleted": Date.now(),
//             "_updated": Date.now()
//         }
//     )
//     res.status(203).json({ 
//         message: `Deleted manga with id ${req.params.id}` 
//     });
// });

module.exports = { getMangaChapter };