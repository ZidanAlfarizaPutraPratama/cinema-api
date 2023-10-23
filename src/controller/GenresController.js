const Genres = require('../Model/GenresModel');

// Create a new genre
const createGenre = async (req, res) => {
  try {
    const { genre_id, name } = req.body;
    const newGenre = new Genres({ genre_id, name });
    const savedGenre = await newGenre.save();
    res.json(savedGenre);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to create a new genre' });
  }
};

// Get all genres
const getAllGenres = async (req, res) => {
  try {
    const genres = await Genres.find();
    res.json(genres);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
};

module.exports = {
  createGenre,
  getAllGenres,
};
