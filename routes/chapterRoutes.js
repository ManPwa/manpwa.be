const express = require("express");
const router = express.Router();
const { passToken, validateToken, validateAdminToken } = require("../middleware/validateTokenHandler");
const { getMangaChapter, createChapter, updateChapter, deleteChapter, getChapter, createReadHistory } = require("../controllers/chapterController");


router.route("/manga/:id/chapter")
    .get(passToken, getMangaChapter)
    .post(validateAdminToken, createChapter);

router.route("/chapter/:id")
    .get(getChapter)
    .put(validateAdminToken, updateChapter)
    .delete(validateAdminToken, deleteChapter);

router.route("/read-history/:id")
    .post(validateToken, createReadHistory);

module.exports = router;