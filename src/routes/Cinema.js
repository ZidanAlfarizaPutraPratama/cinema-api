const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bodyParser = require("body-parser");
const Genres = require("../Model/GenresModel.js");
const Rooms = require("../Model/RoomsModel.js");
const Movie = require("../Model/MoviesModel.js");
const cors = require("cors");
const movieController = require("../controller/MovieController.js");
const GenreController = require("../controller/GenresController.js");
const RoomsController = require("../controller/RoomsController.js");
const ip = require("ip");

const app = express();
app.db = mongoose
  .connect(
    "mongodb+srv://zidanalfariza:fYHwnm5hg23arMn4@cluster0.5vzcaw6.mongodb.net/Tickets",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Databases Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

//genre
app.post("/genre", async (req, res) => {
  const { name, genre_id } = req.body;
  const data = await Genres.findOne({ name });
  console.log(data);
  if (!data) {
    console.log("Tidak Ditemukan");
    const newGenres = new Genres({ genre_id, name });
    await newGenres.save();
    res.json("Data Berhasil Di Simpan");
  } else {
    res.json("Data Sudah Ada");
  }
});

app.get("/genre", async (req, res) => {
  try {
    const genres = await Genres.find();
    res.json(genres);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Terdapat kesalahan dalam mengambil data film" });
  }
});

app.put("/genre/:genre_id", async (req, res) => {
  const { genre_id } = req.params;
  const { name } = req.body;
  try {
    const genre = await Genres.findOneAndUpdate(
      { genre_id },
      { name },
      { new: true }
    );
    if (genre) {
      res.json("Data Berhasil Diperbarui");
    } else {
      res.json("Data Tidak Ditemukan");
    }
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Terdapat kesalahan dalam memperbarui data genre" });
  }
});

app.delete("/genre/:genre_id", async (req, res) => {
  const { genre_id } = req.params;
  try {
    const genre = await Genres.findOneAndDelete({ genre_id });
    if (genre) {
      res.json("Data Berhasil Dihapus");
    } else {
      res.json("Data Tidak Ditemukan");
    }
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Terdapat kesalahan dalam menghapus data genre" });
  }
});
//movie
app.post("/movies", async (req, res) => {
  const { movie_id, name, genres, release_date, aired } = req.body;
  try {
    const existingMovie = await Movie.findOne({ name });
    if (existingMovie) {
      return res.json("Data Ada");
    }

    const genreIds = [];

    for (const genreId of genres) {
      const genre = await Genres.findOne({ genre_id: genreId });
      if (!genre) {
        return res.status(500).json("Genre tidak terdaftar");
       }

      genreIds.push(genre.genre_id);
      
    }    const newMovie = new Movie({

      movie_id,
      name,
      genres: genreIds,
      release_date,
      aired,
    });
    await newMovie.save();
    res.json("Data Berhasil Disimpan");
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Terdapat kesalahan" });
  }
});

app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Terdapat kesalahan dalam mengambil data film" });
  }
});

app.put("/movies/:movie_id", async (req, res) => {
  const { movie_id } = req.params;
  const { name, genres, release_date, aired } = req.body;

  try {
    const movie = await Movie.findOneAndUpdate(
      { movie_id: movie_id }, // Query to find the movie by its movie_id
      { name, genres, release_date, aired },
      { new: true }
    );

    if (movie) {
      res.json("Data Berhasil Diperbarui");
    } else {
      res.json("Data Tidak Ditemukan");
    }
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Terdapat kesalahan dalam memperbarui data movie" });
  }
});

app.delete("/movie/:movie_id", async (req, res) => {
  const { movie_id } = req.params;
  try {
    const movie = await Movie.findOneAndDelete({ movie_id });
    if (movie) {
      res.json("Data Berhasil Dihapus");
    } else {
      res.json("Data Tidak Ditemukan");
    }
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Terdapat kesalahan dalam menghapus data movie" });
  }
});

//Rooms
app.post("/rooms", async (req, res) => {
  const { room_id, name } = req.body;

  try {
    const existingRoom = await Rooms.findOne({ room_id });

    if (!existingRoom) {
      const newRoom = new Rooms({ room_id, name });
      const savedRoom = await newRoom.save();
      res.json("Data Berhasil Disimpan");
    } else {
      res.json("Data Ada");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Terdapat kesalahan" });
  }
});

app.get("/rooms", async (req, res) => {
  try {
    const rooms = await Rooms.find();
    res.json(rooms);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Terdapat kesalahan dalam mengambil data room" });
  }
});

app.put("/rooms/:rooms_id", async (req, res) => {
  const { room_id } = req.params;
  const { name } = req.body;
  try {
    const room = await Rooms.findOneAndUpdate(
      { room_id },
      { name },
      { new: true }
    );
    if (room) {
      res.json("Data Berhasil Diperbarui");
    } else {
      res.json("Data Tidak Ditemukan");
    }
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Terdapat kesalahan dalam memperbarui data room" });
  }
});

app.delete("/rooms/:room_id", async (req, res) => {
  const { room_id } = req.params;
  console.log(room_id);
  try {
    const room = await Rooms.findOneAndDelete({ room_id: room_id });
    console.log(room);
    if (room) {
      res.json("Data Berhasil Dihapus");
    } else {
      res.json("Data Tidak Ditemukan");
    }
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Terdapat kesalahan dalam menghapus data room" });
  }
});

app.listen(3090, () => {
  console.log("IP Address:", ip.address());
  console.log("Listening To: 3090");
});
app.post("/add-user", (req, res) => InsertUser(req, res));
