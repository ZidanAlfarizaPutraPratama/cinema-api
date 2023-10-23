// controllers/movieController.js
const Movie = require('../Model/MoviesModel.js');

// Mendapatkan daftar semua film
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movies.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
