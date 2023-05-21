const express = require("express");
const router = express.Router();
const { validateToken, validateAdminToken } = require("../middleware/validateTokenHandler");
const { getMangas, getManga, createManga, updateManga, deleteManga, followManga, getFollowingManga } = require("../controllers/mangaController");
const fileUploader = require('../config/cloudinary.config');

router.route("/manga").get(getMangas).post(validateAdminToken, createManga);

router.route("/manga/:id")
    .get(getManga)
    .put(validateAdminToken, fileUploader.single('file'), updateManga)
    .delete(validateAdminToken, deleteManga);
  
router.route("/manga/:id/follow").post(validateToken, followManga);

router.route("/manga/follow").post(validateToken, getFollowingManga);

module.exports = router;