const express = require("express");
const router = express.Router();

const { getChapterImage } = require("../controllers/imageController");

// router.route("/");

// router.route("/:id").put(updateChapter).delete(deleteChapter);

// router.route("/:manga_id/chapter").get(getMangaChapter).post(createChapter);

router.route("/chapter/:chapter_id/image").get(getChapterImage);

module.exports = router;