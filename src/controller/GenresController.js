
const Genres = require('../Model/GenresModel');

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

const getAllGenre = async (req, res) => {
  try {
    const genres = await Genres.find({});
    res.json(genres);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
};

// Update a genre by ID
const updateGenre = async (req, res) => {
  try {
    const { genre_id, name } = req.body;
    const genre = await Genres.findByIdAndUpdate(req.params.id, { genre_id, name }, { new: true });
    res.json(genre);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to update the genre' });
  }
};

// Delete a genre by ID
const deleteGenre = async (req, res) => {
  try {
    await Genres.findByIdAndRemove(req.params.id);
    res.json({ message: 'Genre deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to delete the genre' });
  }
};

const getGenreById = async (req, res) => {
  try {
    const { genre_id } = req.query;

    // Cari genre berdasarkan genre_id
    const genre = await Genres.findOne({ genre_id });

    if (!genre) {
      return res.status(404).json({ error: 'Genre dengan ID tersebut tidak ditemukan' });
    }

    res.status(200).json(genre);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data genre berdasarkan ID' });
  }
};

// memperbarui genre berdasarkan ID
const updateGenreById = async (req, res) => {
  try {
    const { genre_id } = req.params;
    const { name } = req.body;

    // Cari genre berdasarkan genre_id
    const genre = await Genres.findOne({ genre_id });

    if (!genre) {
      return res.status(404).json({ error: 'Genre dengan ID tersebut tidak ditemukan' });
    }

    //Update nama genre
    genre.name = name;
    await genre.save();

    res.json('Data Berhasil Diperbarui');
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui data genre' });
  }
};

// Controller untuk menghapus genre berdasarkan ID
const deleteGenreById = async (req, res) => {
  try {
    const { genre_id } = req.params;

    // Hapus genre berdasarkan genre_id
    const genre = await Genres.findOneAndDelete({ genre_id });

    if (!genre) {
      return res.status(404).json({ error: 'Genre dengan ID tersebut tidak ditemukan' });
    }

    res.json('Data Berhasil Dihapus');
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus data genre' });
  }
};

module.exports = {
  createGenre,
  getAllGenre,
  updateGenre,
  deleteGenre,
  getGenreById,
  updateGenreById,
  deleteGenreById,
};
