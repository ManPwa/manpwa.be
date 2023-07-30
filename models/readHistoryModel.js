const mongoose = require("mongoose");
const baseSchema = require("./baseModel");

const readHistorySchema = new mongoose.Schema(
    {
        user_id: { type: String, required: [true, "user_id is required"], },
        chapter_id: { type: String, required: [true, "chapter_id is required"], }
    },
    {
        versionKey: false
    }
);

readHistorySchema.add(baseSchema)

module.exports = mongoose.model("ReadHistory", readHistorySchema, "read-history");