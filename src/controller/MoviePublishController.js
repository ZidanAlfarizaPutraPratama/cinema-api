const Movie = require('../Model/MoviesModel');
const Rooms = require('../Model/RoomsModel'); 
const MoviePublish = require('../Model/MoviePublish');
const moment = require('moment'); 
moment.locale('id'); 

const createMoviePublish = async (req, res) => {
  try {
    const { no_publish, movie_id, room_id, is_ended, start_time, end_time } = req.body;

    if (!no_publish || !movie_id || !room_id || is_ended === undefined || !start_time || !end_time) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    const movie = await Movie.findOne({ movie_id });
    if (!movie) {
      return res.status(404).json({ error: 'Movie dengan movie_id tersebut tidak ditemukan' });
    }

    const room = await Rooms.findOne({ room_id });
    if (!room) {
      return res.status(404).json({ error: 'Room dengan room_id tersebut tidak ditemukan' });
    }

    const conflictingPublications = await MoviePublish.find({
      room_id,
      start_time: { $lt: end_time },
      end_time: { $gt: start_time },
    });

    const totalSeats = room.total_seat;
    const allSeats = Array.from({ length: totalSeats }, (_, index) => (index + 1));
    const usedSeats = [];
    conflictingPublications.forEach((publication) => {
      usedSeats.push(...publication.available_seat);
    });

    const availableSeats = allSeats.filter((seat) => !usedSeats.includes(seat));

    const currentTime = moment().format('YYY-MM-DD');

    const moviePublish = new MoviePublish({
      no_publish,
      movie_id,
      room_id,
      available_seat: availableSeats,
      start_time: start_time, 
      end_time: end_time,     
      is_ended,
    });
    
    await moviePublish.save();

    res.status(201).json(moviePublish);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menyimpan data Movie Publish' });
  }
};

const closeMoviePublish = async (req, res) => {
  try {
    const { no_publish } = req.params;
    const moviePublish = await MoviePublish.findOne({ no_publish });

    if (!moviePublish) {
      return res.status(404).json({ error: 'Movie Publish with that no_publish was not found' });
    }

    moviePublish.is_ended = true;
    await moviePublish.save();
    
    res.json({ message: 'Movie Publish has been closed', moviePublish });
  } catch (error) {
    res.status(500).json({ error: 'Failed to close Movie Publish' });
  }
};

module.exports = {
  createMoviePublish,
  closeMoviePublish,
};