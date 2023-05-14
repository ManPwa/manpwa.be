const mongoose = require("mongoose");

const mangaSchema = mongoose.Schema(
    {
        _id: { 
            type: String, 
            required: [true, "_id is required"] 
        },
        title: { type: String },
        description: { type: String },
        year: { type: Number },
        status: { type: String },
        demographic: { type: String },
        cover_art_url: { type: String },
        author: { type: String },
        tags: { type: Array },
        original_language: { type: String },
        _deleted: { type: Date },
        _updated: { type: Date },
        _created: { type: Date },
        _updater: { type: String }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Manga", mangaSchema, "manga");