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

    const dateFilter = {
      date: {
        $gte: new Date(start_date),
        $lte: new Date(end_date),
      },
      is_used: true,
    };

    const pipeline2 = [
      {
        $match: dateFilter,
      },
      {
        $lookup: {
          from: "moviePublishes",
          localField: "no_publish",
          foreignField: "no_publish",
          as: "moviePublish"
        },
      },
    ];

    const ticketReportsByGenres = await Ticket.aggregate(pipeline2);

    console.log(ticketReportsByGenres);

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
    const seatStatus = req.query.seat_status;
    const startDate = req.query.start_date;
    const endDate = req.query.end_date;

    const dateFilter = {
      start_time: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    if (seatStatus === 'full') {
      dateFilter.existed_seats = 0;
    }

    console.log('Date Filter:', dateFilter);

    // Aggregation
    const pipeline = [
      {
        $lookup: {
          from: "movies",
          localField: "movie_id",
          foreignField: "movie_id",
          as: "movie_lookup"
        }
      },
      {
        $unwind: "$movie_lookup"
      },
      {
        $addFields: {
          existed_seats: {$size: "$available_seat"}
        }
      },
      {
        $match: dateFilter,
      },
    ];

    const result = await MoviePublish.aggregate(pipeline);

    console.log('Result:', result);
    let message = '';
    if (seatStatus === 'full') {
      message = 'Ruangan sudah habis.';
    } else {
      message = 'Masih ada sisa kursi yang tersedia.';
    }

    res.json({ message, result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan dalam permintaan.' });
  }
};

module.exports = {
  getTicketReports,
  getTicketReportsByMovies,
  getTicketReportsByGenres,
  getMoviePublishReportsWithSeats
};
