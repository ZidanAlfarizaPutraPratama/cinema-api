const { Schema, model } = require("mongoose");

const TicketSchema = new Schema({
  no_ticket: {
    type: String,
    required: true,
  },
  no_publish: {
    type: String,
    required: true,
  },
  customer_name: {
    type: String,
    required: true,
  },
  seat_number: {
    type: Number,
    required: true,
  },
  is_used: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Ticket = model("tickets", TicketSchema, "tickets");
module.exports = Ticket;
