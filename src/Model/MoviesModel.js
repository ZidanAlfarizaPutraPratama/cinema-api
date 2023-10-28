const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const MovieSchema = new Schema({
    movie_id: String,
    name: String,
    genres: [String],
    release_date: String,
    aired: String
});

const Movie = model("movies", MovieSchema, "movies");
module.exports = Movie;
