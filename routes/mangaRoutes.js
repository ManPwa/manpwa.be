const express = require("express");
const router = express.Router();
const { passToken, validateAdminToken } = require("../middleware/validateTokenHandler");
const { getMangas, getManga, createManga, updateManga, deleteManga, followManga, getFollowingManga } = require("../controllers/mangaController");
const fileUploader = require('../config/cloudinary.config');

router.route("/manga").get(passToken, getMangas).post(validateAdminToken, fileUploader.single('file'), createManga);

router.route("/manga/:id")
    .get(getManga)
    .put(validateAdminToken, fileUploader.single('file'), updateManga)
    .delete(validateAdminToken, deleteManga);

module.exports = router;