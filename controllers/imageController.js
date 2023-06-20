const asyncHandler = require("express-async-handler");
const Chapter = require("../models/chapterModel");
const Image = require("../models/imageModel");


//@desc Get all image of a chapter
//@rout GET /api/chapter/:id/image
//@access public
const getChapterImage = asyncHandler(async (req, res) => {
    const chapter = await Chapter.findOne({
        "_id": req.params.id,
        "_deleted": null
    });
    if (!chapter) {
        res.status(404);
        throw new Error("Chapter not found")
    }
    aggregate = [
        {
            "$match": {
                "_deleted": null,
                "chapter_id": req.params.id,
            },
        },
        {
            "$sort": {
                "page": 1,
            }
        }
    ];
    if (req.query.range) {
        range = JSON.parse(req.query.range)
        aggregate.push({ "$skip": range[0] });
        aggregate.push({ "$limit": (range[1] - range[0] + 1) });
    }
    const image_list = await Image.aggregate(aggregate);
    const total_image = await Image.count({
        "_deleted": null,
        "chapter_id": req.params.id,
    });
    res.setHeader('Content-Range', `posts : 0-100/${total_image}`).status(200).json(image_list);
});


//@desc Get image
//@rout GET /api/image:id
//@access public
const getImage = asyncHandler(async (req, res) => {
    const image = await Image.findOne({
        "_id": req.params.id,
        "_deleted": null
    });
    res.status(200).json(image || {}).header({ "Content-Range": "0-20/20" });
});

//@desc Create chapter image
//@rout POST /api/chapter/:id/image
//@access private
const createChapterImage = asyncHandler(async (req, res) => {
    req.body.chapter_id = req.params.id;
    if (req.file) {
        image_url = req.file.path;
        req.body.image_url = image_url;
    };
    const created_image = await Image.create(req.body);
    res.status(201).json({
        message: "Create image successful",
        "image_id": created_image._id
    });
});


//@desc Update chapter image
//@rout PUT /api/image/:id
//@access private
const updateChapterImage = asyncHandler(async (req, res) => {
    const image = await Image.findOne({
        "_id": req.params.id,
        "_deleted": null
    });
    if (!image) {
        res.status(404);
        throw new Error("Image not found");
    }
    if (req.body.chapter_id != image.chapter_id) {
        res.status(403);
        throw new Error("Cannot update chapter id");
    }
    if (req.file) {
        image_url = req.file.path;
        req.body.image_url = image_url;
    };
    req.body._updated = Date.now();
    await Image.findByIdAndUpdate(
        req.params.id,
        req.body
    );
    res.status(202).json({
        message: `Updated image with id ${req.params.id}`
    });
});


//@desc Delete chapter image
//@rout Delete /api/image/:id
//@access private
const deleteChapterImage = asyncHandler(async (req, res) => {
    const image = await Image.findOne({
        "_id": req.params.id,
        "_deleted": null
    });
    if (!image) {
        res.status(404);
        throw new Error("Image not found");
    }
    await Image.findByIdAndUpdate(
        req.params.id,
        {
            "_deleted": Date.now(),
            "_updated": Date.now()
        }
    )
    res.status(203).json({
        message: `Deleted image with id ${req.params.id}`
    });
});

module.exports = { getImage, getChapterImage, createChapterImage, updateChapterImage, deleteChapterImage };