const express = require("express");
const router = express.Router();
const { validateAdminToken } = require("../middleware/validateTokenHandler");
const { getImage, getChapterImage, createChapterImage, updateChapterImage, deleteChapterImage } = require("../controllers/imageController");
const fileUploader = require('../config/cloudinary.config');

// router.route("/");

// router.route("/:id").put(updateChapter).delete(deleteChapter);

// router.route("/:manga_id/chapter").get(getMangaChapter).post(createChapter);

router.route("/chapter/:id/image")
    .get(getChapterImage)
    .post(validateAdminToken, fileUploader.single('file'), createChapterImage);

router.route("/image/:id")
    .get(getImage)
    .put(validateAdminToken, fileUploader.single('file'), updateChapterImage)
    .delete(validateAdminToken, deleteChapterImage);

module.exports = router;