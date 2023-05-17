const express = require("express");
const router = express.Router();

const { getMangaChapter } = require("../controllers/chapterController");

// router.route("/");

// router.route("/:id").put(updateChapter).delete(deleteChapter);

// router.route("/:manga_id/chapter").get(getMangaChapter).post(createChapter);

router.route("/:manga_id/chapter").get(getMangaChapter);

module.exports = router;