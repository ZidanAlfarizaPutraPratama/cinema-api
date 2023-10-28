const Genres = require('../Model/GenresModel.js');
const Movie = require('../Model/MoviesModel.js');
const moment = require('moment'); 
moment.locale('id');


// Create a new movie
const createMovie = async (req, res) => {
  const {
    movie_id,
    name,
    genre_id,
    release_date,
    aired
  } = req.body;
  try {
    // Periksa apakah movie_id sudah digunakan
    const existingMovie = await Movie.findOne({ movie_id });
    if (existingMovie) {
      return res.status(400).json({ error: 'Movie dengan movie_id tersebut sudah ada' });
    }

    const formattedReleaseDate = moment(new Date(release_date)).format('L').replace(/\//g, "-");
    const formattedAired = moment(new Date(aired)).format('L').replace(/\//g, "-");

    const newMovie = new Movie({
      movie_id,
      name,
      genres: genre_id,
      release_date: formattedReleaseDate,
      aired: formattedAired
    });

    await newMovie.save();

    res.status(201).json({ message: 'Film berhasil dibuat', newMovie });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Gagal membuat film' });
  }
}

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Temukan film berdasarkan movie_id
const updateMovie = async (req, res) => {
  try {
    const { movie_id } = req.params;
    const { name, genres, release_date, aired } = req.body;
    
    const movie = await Movie.findOne({ movie_id });
    
    if (!movie) {
      return res.status(404).json({ error: 'Movie with that movie_id was not found' });
    }

    // Update movie fields
    movie.name = name;
    movie.genres = genres;
    movie.release_date = release_date;
    movie.aired = aired;

    // Save the updated movie
    await movie.save();

    res.json({ message: 'Movie has been successfully updated', movie });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update movie' });
  }
};

// Delete a movie by ID
const deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndRemove(req.params.id);
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createMovie,
  getAllMovies,
  updateMovie,
  deleteMovie,
};