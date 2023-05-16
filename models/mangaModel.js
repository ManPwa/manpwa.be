const mongoose = require("mongoose");
const uuid = require("uuid");

const mangaSchema = mongoose.Schema(
    {
        _id: { 
            type: String, 
            required: [true, "_id is required"],
            default: uuid.v4() 
        },
        title: { type: String, default: null },
        description: { type: String, default: null },
        year: { type: Number, default: null },
        status: { type: String, default: null },
        demographic: { type: String, default: null },
        cover_art_url: { type: String, default: null },
        author: { type: String, default: null },
        tags: { type: Array },
        original_language: { type: String, default: null },
        _deleted: { type: Date, default: null },
        _updated: { type: Date, default: Date.now() },
        _created: { type: Date, default: Date.now() },
        _updater: { type: String, default: null }
    }, 
    {
        versionKey: false
    }
);

module.exports = mongoose.model("Manga", mangaSchema, "manga");