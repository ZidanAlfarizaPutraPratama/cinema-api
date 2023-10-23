// controllers/RoomsController.js
const Rooms = require('../Model/RoomsModel.js');

const createRoom = async (req, res) => {
  try {
    const newRoom = new Rooms(req.body);
    const savedRoom = await newRoom.save();
    res.json(savedRoom);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create a new Room' });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Rooms.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Rooms' });
  }
};
module.exports = {
  createRoom,
  getAllRooms,
};
