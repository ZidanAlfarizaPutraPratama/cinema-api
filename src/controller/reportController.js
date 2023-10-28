const Ticket = require('../Model/TicketModel');


const getTicketReports = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const matchStage = {
      $match: {} 
    };

    if (start_date) {
      matchStage.$match.date = { $gte: new Date(start_date) };
    }

    if (end_date) {
      if (!matchStage.$match.date) matchStage.$match.date = {};
      matchStage.$match.date.$lte = new Date(end_date);
    }

    const groupStage = {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
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
    res.status(500).json({ error: 'Failed to retrieve ticket reports' });
  }
};

module.exports = {
  getTicketReports,
};
