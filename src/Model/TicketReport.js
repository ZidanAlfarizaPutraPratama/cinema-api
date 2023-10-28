const mongoose = require('mongoose');

const ticketReportSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  totalTickets: {
    type: Number,
    required: true,
  },
});

const TicketReport = mongoose.model('TicketReport', ticketReportSchema);

module.exports = TicketReport;
