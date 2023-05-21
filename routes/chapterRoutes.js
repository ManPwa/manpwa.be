const express = require("express");
const router = express.Router();
const { validateToken, validateAdminToken } = require("../middleware/validateTokenHandler");
const { getMangaChapter, createChapter, updateChapter, deleteChapter } = require("../controllers/chapterController");


router.route("/manga/:id/chapter")
    .get(getMangaChapter)
    .post(validateAdminToken, createChapter);

router.route("/chapter/:id")
    .put(validateAdminToken, updateChapter)
    .delete(validateAdminToken, deleteChapter);

module.exports = router;