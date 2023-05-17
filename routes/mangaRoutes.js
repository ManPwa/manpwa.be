const express = require("express");
const router = express.Router();

const { getMangas, getManga, createManga, updateManga, deleteManga } = require("../controllers/mangaController");

router.route("/manga").get(getMangas).post(createManga);

router.route("/manga/:id").get(getManga).put(updateManga).delete(deleteManga);

module.exports = router;