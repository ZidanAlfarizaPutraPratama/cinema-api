const { Schema, model } = require("mongoose");

const MovieSchema = new Schema({
    movie_id: { type: String, default: "-" },
    name: { type: String, default: "-" },
    genres: { type: [String], default: [] },
    release_date: { type: Date, default:() => new Date() },
    aired : { type: Number, default: 0 }
});

const Movie = model("Movie", MovieSchema, "Movie");
module.exports = Movie;
