const mongoose = require('mongoose');

const FormDataSchema = new mongoose.Schema({
    name: String,
    total_seat: Number,
    genre: String
});

const FormDataFilm = mongoose.model('film_db', FormDataSchema);

module.exports = FormDataFilm;
