const asyncHandler = require("express-async-handler");
const Chapter = require("../models/chapterModel");
const Manga = require("../models/mangaModel");
const ReadHistory = require("../models/readHistoryModel");
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
    const total_chapter = await Chapter.count({
        "_deleted": null,
        "manga_id": req.params.id,
    });
    user_id = "";
    if (req.user) {
        user_id = req.user._id;
    }
    aggregate = [
        {
            "$match": {
                "_deleted": null,
                "manga_id": req.params.id,
            },
        },
        {
            $lookup: {
                from: "read-history",
                let: { user: user_id, id: "$_id"},
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$user_id', '$$user']},
                                    { $eq: ['$chapter_id', '$$id']}
                                ]
                            }
                        }
                    },
                ],
                as: "history"
            }
        },
        {
            $set: {"read": "$history._id"}
        },
        { $unset: "history" },
        {
            "$sort": {
                "chapter": -1,
            }
        }
    ];
    if (req.query.range) {
        range = JSON.parse(req.query.range)
        aggregate.push({ "$skip": range[0] });
        aggregate.push({ "$limit": (range[1] - range[0] + 1) });
    }
    const chapter_list = await Chapter.aggregate(aggregate);
    res.setHeader('Content-Range', `posts : 0-9/${total_chapter}`).status(200).json(chapter_list);
});


//@desc Get chapter
//@rout GET /api/chapter:id
//@access public
const getChapter = asyncHandler(async (req, res) => {
    const chapter = await Chapter.findOne({
        "_id": req.params.id,
        "_deleted": null
    });
    res.status(200).json(chapter || {}).header({ "Content-Range": "0-20/20" });
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
    const chapter = await Chapter.findOne({
        "_id": req.params.id,
        "_deleted": null,
    });
    if (!chapter) {
        res.status(404);
        throw new Error("Chapter not found");
    }
    if (req.body.manga_id != chapter.manga_id) {
        res.status(403);
        throw new Error("Cannot update manga id");
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


//@desc Create read-history
//@rout POST /api/read-history
//@access public
const createReadHistory = asyncHandler(async (req, res) => {
    const read_hisotry = await ReadHistory.findOne({
        "chapter_id": req.params.id,
        "user_id": req.user._id
    });
    if (read_hisotry) {
        res.status(201).json({
            message: "Already read"
        });
    } else {
        const created_read_hisotry = await ReadHistory.create({
            "chapter_id": req.params.id,
            "user_id": req.user._id
        });
        res.status(201).json({
            message: "Create read history successful",
            "history_id": created_read_hisotry._id
        });
    }
});


module.exports = { getMangaChapter, createChapter, updateChapter, deleteChapter, getChapter, createReadHistory };