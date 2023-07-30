const asyncHandler = require("express-async-handler");
const Manga = require("../models/mangaModel");
const MangaView = require("../models/viewMangaModel");
const Chapter = require("../models/chapterModel");
var request = require('request');

const getRecommendManga = async (user_id) => {
    url = 'http://127.0.0.1:5003';
    const response = await fetch(`${url}/recommendations/manga?user_id=${user_id}`);
    const myJson = await response.json();
    return myJson;
}

//@desc Get all manga
//@rout GET /api/manga
//@access public
const getMangas = asyncHandler(async (req, res) => {
    const total_manga = await Manga.count({
        "_deleted": null
    });
    range = [0, 23]
    if (req.user) {
        list_manga_id = await getRecommendManga(req.user._id)
        if (list_manga_id.length > 0) {
            manga_list = await Manga.find({
                "_id": { $in: list_manga_id },
                "_deleted": null
            });
            response = {
                "total_manga": total_manga,
                "manga_list": manga_list || []
            }
            return res.setHeader('Content-Range', `posts : ${range[0]}-${range[1]}/${total_manga}`).status(200).json(response);
        }
    }
    if (req.query.range) {
        try {
            range = JSON.parse(req.query.range)
            match = {
                "_deleted": null,
            };
            if (req.query.title) {
                match["$text"] = { $search: req.query.title.replace('\"', '') } 
            }
            manga_list = await Manga.aggregate([
                {
                    "$match": match
                },
                { "$sort": { "_updated": -1 } },
                { "$skip": range[0] },
                { "$limit": (range[1] - range[0] + 1) },
                {
                    "$addFields": {
                        "id": "$_id"
                    }
                }
            ]);
        } catch (e) {
            console.log(e);
        }
        response = manga_list;
    } else {
        if (req.query.title) {
            manga_list = await Manga.find({
                "_deleted": null
            }).limit(24)
                .skip((req.query.page || 0) * 24)
                .find({ $text: { $search: req.query.title } });
        } else {
            try {
                if (req.query.sort) {
                    sort = JSON.parse(req.query.sort)
                } else {
                    sort = {"_created": 1}
                }
                manga_list = await MangaView.aggregate([
                    {
                        "$match": {
                            "_deleted": null
                        } 
                    },
                    { "$sort": sort },
                    { "$skip": (req.query.page || 0) * (parseInt(req.query.limit) || 24) },
                    { "$limit": parseInt(req.query.limit) || 24 }
                ]);
            } catch (e) {
                console.log(e);
            }
        }
        response = {
            "total_manga": total_manga,
            "manga_list": manga_list || []
        }
    }
    res.setHeader('Content-Range', `posts : ${range[0]}-${range[1]}/${total_manga}`).status(200).json(response);
});


//@desc Get all manga
//@rout GET /api/manga
//@access public
const getMangasWithRange = asyncHandler(async (req, res) => {
    manga_list = await Manga.find({
        "_deleted": null
    }).sort({"_created": -1});
    res.status(200).json(manga_list || []);
});

//@desc Get all manga
//@rout GET /api/manga
//@access public
const getManga = asyncHandler(async (req, res) => {
    const manga = await MangaView.findOne({
        "_id": req.params.id,
        "_deleted": null
    });
    res.status(200).json(manga || {}).header({"Content-Range": "0-20/20"});
});


//@desc Create new manga
//@rout POST /api/mangas
//@access private
const createManga = asyncHandler(async (req, res) => {
    if (req.file) {
        cover_art_url = req.file.path;
        req.body.cover_art_url = cover_art_url;
    };
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
    const manga = await Manga.findOne({
        "_id": req.params.id,
        "_deleted": null
    });
    if (!manga) {
        res.status(404);
        throw new Error("Manga not found")
    }
    if (req.file) {
        cover_art_url = req.file.path;
        req.body.cover_art_url = cover_art_url;
    };
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
    const manga = await Manga.findOne({
        "_id": req.params.id,
        "_deleted": null
    });
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


module.exports = { getMangas, getManga, createManga, updateManga, deleteManga, getMangasWithRange };