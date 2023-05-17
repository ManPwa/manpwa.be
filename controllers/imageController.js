const asyncHandler = require("express-async-handler");
const Chapter = require("../models/chapterModel");
const Image = require("../models/imageModel")
const uuid = require("uuid");
//@desc Get all image of a chapter
//@rout GET /api/chapter/:chapter_id/image
//@access public
const getChapterImage = asyncHandler(async (req, res) => {
    const chapter = await Chapter.findById(req.params.chapter_id);
    if (!chapter) {
        res.status(404);
        throw new Error("Chapter not found")
    }
    const image_list = await Image.find({
        "_deleted": null,
        "chapter_id": req.params.chapter_id,
    }).sort({
        "page": 1,
    });
    res.status(200).json(image_list);
});

module.exports = { getChapterImage };