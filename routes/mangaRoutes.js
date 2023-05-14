const express = require("express");
const router = express.Router();

const { getMangas, getManga, createManga, updateManga, deleteManga } = require("../controllers/mangaController");

router.route("/").get(getMangas).post(createManga);

router.route("/:id").get(getManga).put(updateManga).delete(deleteManga);

module.exports = router;