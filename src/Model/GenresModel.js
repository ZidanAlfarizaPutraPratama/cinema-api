const { Schema, model } = require("mongoose");

const GenresSchema = new Schema({
    genre_id: { type: String, required: true },
    name: { type: String, default: "-" }
});

const Genres = model("genres", GenresSchema, "genres");

module.exports = Genres;
 