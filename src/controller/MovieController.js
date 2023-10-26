const Movie = require('../Model/MoviesModel.js');

// Create a new movie
const createMovie = async (req, res) => {
  try {
    const { movie_id, name, genres, release_date, aired } = req.body;
    const existingMovie = await Movie.findOne({ name });

    if (existingMovie) {
      return res.status(400).json({ error: 'Film dengan nama tersebut sudah ada' });
    }

    const genreIds = [];

    for (const genreId of genres) {
      const genre = await Genres.findOne({ genre_id: genreId });

      if (!genre) {
        return res.status(400).json({ error: 'Genre tidak terdaftar' });
      }

      genreIds.push(genre.genre_id);
    }

    const newMovie = new Movie({
      movie_id,
      name,
      genres: genreIds,
      release_date,
      aired,
    });

    await newMovie.save();

    res.status(201).json({ message: 'Film berhasil dibuat', newMovie });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Gagal membuat film' });
  }
};

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