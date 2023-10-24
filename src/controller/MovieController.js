const Movie = require('../Model/MoviesModel.js');

// Create a new movie
exports.createMovie = async (req, res) => {
  try {
    const { title, director, genre, releaseDate } = req.body;
    const newMovie = new Movie({ title, director, genre, releaseDate });
    const savedMovie = await newMovie.save();
    res.json(savedMovie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all movies
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a movie by ID
exports.updateMovie = async (req, res) => {
  try {
    const { title, director, genre, releaseDate } = req.body;
    const movie = await Movie.findByIdAndUpdate(req.params.id, { title, director, genre, releaseDate }, { new: true });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a movie by ID
exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndRemove(req.params.id);
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  module.exports = {
    createMovie,
    getAllMovies,
    updateMovie,
    deleteMovie,
  }
};
