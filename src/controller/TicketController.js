const MoviePublish = require("../Model/MoviePublish");
const Ticket = require("../Model/TicketModel");

const createTicket = async (req, res) => {
  try {
    const { no_publish, customer_name, seat_number } = req.body;

    const currentTime = new Date();
    const moviePublish = await MoviePublish.findOne({ no_publish });

    if (!moviePublish) {
      return res.status(404).json({ error: "Movie Publish not found" });
    }

    if (currentTime > new Date(moviePublish.start_time)) {
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

    const ticket = new Ticket({
      no_ticket,
      no_publish,
      customer_name,
      seat_number,
      is_used: false,
      date: new Date(),
    });

    await ticket.save();

    res.status(201).json({ message: "Ticket successfully created", ticket });
  } catch (error) {
    res.status(500).json({ error: "Failed to create a ticket" });
  }
};

function generateUniqueNoTicket() {
  const uniqueTicketNumber = `${Date.now()}-${Math.floor(
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

    const currentTime = new Date();
    const moviePublish = await MoviePublish.findOne({
      no_publish: ticket.no_publish,
    });

    if (!moviePublish) {
      return res.status(404).json({ error: "Movie Publish not found" });
    }

    if (currentTime > new Date(moviePublish.end_time)) {
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
