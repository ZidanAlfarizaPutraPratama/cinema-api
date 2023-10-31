const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Genres = require("../Model/GenresModel.js");
const Rooms = require("../Model/RoomsModel.js");
const Movie = require("../Model/MoviesModel.js");
const MoviePublish = require("../Model/MoviePublish.js");
const Ticket = require("../Model/TicketModel.js");
const cors = require("cors");
const movieController = require("../controller/MovieController.js");
const GenreController = require("../controller/GenresController.js");
const RoomsController = require("../controller/RoomsController.js");
const MoviePublishController = require("../controller/MoviePublishController.js");
const TiketController = require("../controller/TicketController.js");
const ReportController = require('../controller/reportController.js');
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
app.use(router);

//Genres
router.post('/genre', GenreController.createGenre);
router.put('/genre', GenreController.updateGenre);
router.get('/genre', GenreController.getAllGenre);

//Genre-by-id
router.get('/genre-by-id', GenreController.getGenreById);
router.put('/genre/:genre_id', GenreController.updateGenreById);
router.delete('/genre/:genre_id', GenreController.deleteGenreById);

//movie
router.post('/movies', movieController.createMovie);
router.put('/movies', movieController.updateMovie);
router.get('/movies', movieController.getAllMovies);
router.delete('/movies', movieController.deleteMovie);

//movie by ID
router.post('/movies/:movie_id', movieController.createMovie);
router.put('/movies/:movie_id', movieController.updateMovie);
router.get('/movies/:movie_id', movieController.getAllMovies);
router.delete('/movies/:movie_id', movieController.deleteMovie);

//movie-publish
router.post('/movie-publishes', MoviePublishController.createMoviePublish);

//room
router.post('/rooms', RoomsController.createRoom);
router.get('/rooms-by-id', RoomsController.GetRoomsById);
router.get('/rooms', RoomsController.getAllRooms);
router.put('/rooms/:room_id', RoomsController.updateRoom);
router.delete('/rooms/:room_id', RoomsController.deleteRoom);

//movie-publish
router.post('/movie-publishes', MoviePublishController.createMoviePublish);
router.post('/movie-publishes/:no_publish/close', MoviePublishController.closeMoviePublish);

//Ticket
router.post('/create-ticket', TiketController.createTicket);
router.post('/tickets/:no_ticket/attend', TiketController.attendMovie);

//Aggregation report
router.get('/tickets/reports', ReportController.getTicketReports);
router.get('/tickets/reports-movies', ReportController.getTicketReportsByMovies);
router.get('/tickets/reports-genres', ReportController.getTicketReportsByGenres);
router.get('/movie-publish/reports-seats', ReportController.getMoviePublishReportsWithSeats);

module.exports = router;

app.listen(3090, () => {
  console.log("IP Address:", ip.address());
  console.log("Listening To: 3090");
});
app.post("/add-user", (req, res) => InsertUser(req, res));