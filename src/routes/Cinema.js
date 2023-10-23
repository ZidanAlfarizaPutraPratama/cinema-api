const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bodyParser = require('body-parser');
const Genres = require('../Model/GenresModel.js');
const Rooms = require("../Model/RoomsModel.js")
const Movie = require('../Model/MoviesModel.js');
const movieController = require('../controller/MovieController.js');
const GenreController = require('../controller/GenresController.js');
const RoomsController = require('../controller/RoomsController.js');

const app = express();
app.db = mongoose.connect(
    'mongodb+srv://zidanalfariza:fYHwnm5hg23arMn4@cluster0.5vzcaw6.mongodb.net/Tickets',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => {
    console.log("Databases Connected")
}).catch((err) => {
    console.log(err);
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//genre
app.post('/genre', async (req, res) => {
    const { name, genre_id } = req.body;
    const data = await Genres.findOne({ name });
    console.log(data);
    if(!data){
        console.log("Tidak Ditemukan")
        const newGenres = new Genres({genre_id, name})
        await newGenres.save();
        res.json("Data Berhasil Di Simpan");
    }else{
        res.json("Data Sudah Ada");
    }
});

app.get('/genre', async (req, res) => {
    try {
      const genres = await Genres.find();
      res.json(genres);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Terdapat kesalahan dalam mengambil data film" });
    }
  });

  //movie
app.post('/movies', async (req, res) => {
    const { movie_id, name, genres, release_date, aired } = req.body;
    const data = await Movie.findOne({ name });
    console.log(data);
    try {
        if (!data) {
            console.log("Tidak Ada");
            const newMovie = new Movie({ name });
            res.json("Data Berhasil Di Simpan");
        } else {
            res.json("Data Ada");
        }
    } catch (e) {
        console.log(e.message)
        res.status(500).json({message: "Terdapat kesalahan"})
    }
});

app.get('/movies', async (req, res) => {
    try {
      const movies = await Movie.find();
      res.json(movies);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Terdapat kesalahan dalam mengambil data film" });
    }
  });

  //Rooms
  app.post('/rooms', async (req, res) => {
    const { Room_id, name } = req.body;
  
    try {
      const existingRoom = await Rooms.findOne({ Room_id });
      
      if (!existingRoom) {
        const newRoom = new Rooms({ Room_id, name });
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
    
  app.get('/rooms',  async (req, res) => {
    try {
      const rooms = await Rooms.find();
      res.json(rooms);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Terdapat kesalahan dalam mengambil data room" });
    }
  });

app.listen(3090, () => console.log("Listening To : 3090"));
app.post("/add-user", (req, res) => InsertUser(req, res));