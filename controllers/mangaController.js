const asyncHandler = require("express-async-handler");
const Manga = require("../models/mangaModel");
//@desc Get all mangas
//@rout GET /api/mangas
//@access public
const getMangas = asyncHandler(async (req, res) => {
    const mangas = await Manga.find().limit(24).skip((req.query.page || 0)*24);
    res.status(200).json(mangas);
});

//@desc Get all mangas
//@rout GET /api/mangas
//@access public
const getManga = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Get manga ${req.params.id}` });
});

//@desc Create new manga
//@rout POST /api/mangas
//@access public
const createManga = asyncHandler(async (req, res) => {
    res.status(201).json({ message: `Create` });
});

//@desc Update manga
//@rout PUT /api/mangas/:id
//@access public
const updateManga = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { email } = req.body;
    if (!email) {
        res.status(400);
        throw new Error("m");
    }
    res.status(202).json({ message: `Update ${req.params.id}` });
});

//@desc Delete manga
//@rout Delete /api/mangas/:id
//@access public
const deleteManga = asyncHandler(async (req, res) => {
    res.status(203).json({ message: `Delete ${req.params.id}` });
});

module.exports = { getMangas, getManga, createManga, updateManga, deleteManga };