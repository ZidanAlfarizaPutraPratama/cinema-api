const MoviePublish = require("../Model/MoviePublish");
const Ticket = require("../Model/TicketModel");
const Moment = require('moment');

const createTicket = async (req, res) => {
  try {
    const { no_publish, customer_name, seat_number } = req.body;

    const currentTime = Moment(); 
    const moviePublish = await MoviePublish.findOne({ no_publish });
    console.log("current", currentTime)
    if (!moviePublish) {
      return res.status(404).json({ error: "Movie Publish not found" });
    }

      console.log(moviePublish.start_time)
    if (currentTime.isAfter(Moment(moviePublish.start_time))) { 
      return res
        .status(400)
        .json({ error: "Current time exceeds the Movie Publish start time" });
    }

    const validSeat = moviePublish.available_seat.includes(seat_number);

    if (!validSeat) { 
      return res
        .status(400)
        .json({ error: "Invalid or already occupied seat number" });
    }

    moviePublish.available_seat = moviePublish.available_seat.filter(
      (seat) => seat !== seat_number
    );

    await moviePublish.save();

    const no_ticket = generateUniqueNoTicket();

    // Waktu awal dalam format ISO8601
    const inputTime = "2023-10-02T12:00:00.000+00:00"; 

// Ubah format waktu
const formattedTime = new Date(inputTime).toISOString().replace('T', ' ').split('.')[0];

console.log(formattedTime); // Output: "2023-10-02 12:00:00"

    const ticket = new Ticket({
      no_ticket,
      no_publish,
      customer_name,
      seat_number,
      is_used: false,
      date: new Date() 
    });

    await ticket.save();

    res.status(201).json({ message: "Ticket successfully created", ticket });
  } catch (error) {
    res.status(500).json({ error: "Failed to create a ticket" });
  }
};

function generateUniqueNoTicket() {
  const uniqueTicketNumber = `${Moment().format('x')}-${Math.floor(
    Math.random() * 1000
  )}`;
  return uniqueTicketNumber;
}

const attendMovie = async (req, res) => {
  try {
    const { no_ticket } = req.params;

    const ticket = await Ticket.findOne({ no_ticket });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    if (ticket.is_used) {
      return res
        .status(400)
        .json({ error: "This ticket has already been used" });
    }

    const currentTime = Moment();
    const moviePublish = await MoviePublish.findOne({
      no_publish: ticket.no_publish,
    });

    if (!moviePublish) {
      return res.status(404).json({ error: "Movie Publish not found" });
    }

    if (currentTime.isAfter(Moment(moviePublish.end_time))) {
      return res
        .status(400)
        .json({ message: "The movie has finished showing" });
    }

    ticket.is_used = true;
    await ticket.save();

    res.status(200).json({ message: "Welcome! Please enter the room!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to attend the movie" });
  }
};

module.exports = {
  createTicket,
  attendMovie,
};