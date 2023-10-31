const Genres = require('../Model/GenresModel');
const MoviePublish = require('../Model/MoviePublish');
const Ticket = require('../Model/TicketModel');
const moment = require('moment');

const getTicketReports = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const matchStage = {
      $match: {} 
    };

    if (start_date) {
      matchStage.$match.date = { $gte: start_date };
    }

    if (end_date) {
      if (!matchStage.$match.date) matchStage.$match.date = {};
      matchStage.$match.date.$lte = end_date;
    }

    const groupStage = {
      $group: {
        _id:"$date",
        totalTickets: { $sum: 1 },
      },
    };

    const sortStage = {
      $sort: { _id: 1 },
    };

    const pipeline = [matchStage, groupStage, sortStage];

    const ticketReports = await Ticket.aggregate(pipeline);

    res.status(200).json({ message: 'Ticket reports retrieved successfully', ticketReports });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: 'Failed to retrieve ticket reports' });
  }
};

const getTicketReportsByMovies = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'Both start_date and end_date are required.' });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date); 
    endDate.setHours(23)
    endDate.setMinutes(59)
    endDate.setSeconds(59)
    const pipeline = [
      {
        $match: {
          is_ended: true,
          start_time: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$movie_id', 
          totalTickets: { $sum: 1 }
        }
      }
    ];

    const ticketReports = await MoviePublish.aggregate(pipeline);

    if (ticketReports.length === 0) {
      return res.status(404).json({ error: 'No sold tickets found in the specified date range.' });
    }

    res.status(200).json({ message: 'Ticket reports by movies retrieved successfully', getTicketReportsByMovies });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve ticket reports by movies' });
  }
};

const getTicketReportsByGenres = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'Both start_date and end_date are required.' });
    }
    const pipeline = [
      {
        $lookup: {
          from: 'Movies',
          localField: 'movie_id',
          foreignField: 'movie_id',
          as: 'movie',
        },
      },
      {
        $unwind: '$movie',
      },
      {
        $unwind: '$genres',
      },
      {
        $match: {
          date: {
            $gte: new Date(start_date), 
            $lte: new Date(end_date), 
          },
          is_used: true, // Hanya tiket yang digunakan
        },
      },
      {
        $group: {
          _id: '$genre.name', 
          totalTickets: { $sum: 1 }, // Menghitung jumlah tiket
        },
      },
    ]; 
    const pipeline2 = [
      {
        $match: {
          date: {
            $gte: start_date, 
            $lte: end_date, 
          },
          is_used: true,
        },
      },
      {
        $lookup: {
          from: "moviePublishes",
          localField: "no_publish",
          foreignField: "no_publish",
          as: "moviePublish"
        }
      },
      {
        $unwind: "$moviePublish"
      },
      {
        $lookup: {
          from: "movies",
          localField: "moviePublish.movie_id",
          foreignField: "movie_id",
          as: "movie"
        }
      },
      {
        $unwind: "$movie"
      },
      {
        $unwind: "$movie.genres"
      },
      {
        $lookup: {
          from: "genres",
          localField: "movie.genres",
          foreignField: "genre_id",
          as: "genre"
        }
      },
      {
        $unwind: "$genre"
      },
      {
        $group: {
          _id: "$genre.name",
          nama_genre: {$first: "$genre.name"},
          totalTicket: {$sum: 1}
        }
      }
      
    ]   

    const ticketReportsByGenres = await Ticket.aggregate(pipeline2);


    console.log(ticketReportsByGenres)
    if (ticketReportsByGenres.length === 0) {
      console.log('No data found.'); 
      return res.status(404).json({ error: 'No sold tickets found in the specified date range.' });
    }

    console.log('Ticket Reports:', ticketReportsByGenres); 
    res.status(200).json({ message: 'Ticket reports by genres retrieved successfully', ticketReportsByGenres });
  } catch (error) {
    console.log('Error:', error); 
    res.status(500).json({ error: 'Failed to retrieve ticket reports by genres' });
  }
};

const getMoviePublishReportsWithSeats = async (req, res) => {
  try {
    const { seat_status, start_date, end_date } = req.query;

    if (!seat_status || !start_date || !end_date) {
      return res.status(400).json({ error: 'seat_status, start_date, and end_date are required.' });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);

    const matchStage = {
      $match: {
        start_time: { $gte: startDate, $lte: endDate },
      },
    };

    if (seat_status === 'full') {
      matchStage.$match.available_seats = 0;
    } else if (seat_status === 'leftover') {
      matchStage.$match.available_seats = { $gt: 0 };
    }

    const groupStage = {
      $group: {
        _id: '$movie_id',
        totalPublishes: { $sum: 1 },
        totalSeats: { $sum: '$available_seats' },
      },
    };

    const sortStage = {
      $sort: { _id: 1 },
    };

    const pipeline = [matchStage, groupStage, sortStage];

    const moviePublishReports = await MoviePublish.aggregate(pipeline);

    if (moviePublishReports.length === 0) {
      return res.status(404).json({ error: 'No movie publishes found in the specified date range and seat condition.' });
    }

    res.status(200).json({ message: 'Movie publish reports with seat condition retrieved successfully', moviePublishReports });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Failed to retrieve movie publish reports with seat condition' });
  }
};


module.exports = {
  getTicketReports,
  getTicketReportsByMovies,
  getTicketReportsByGenres,
  getMoviePublishReportsWithSeats
};
