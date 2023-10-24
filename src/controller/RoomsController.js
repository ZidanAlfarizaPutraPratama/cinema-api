const Rooms = require('../Model/RoomsModel.js');

// Create a new room
const createRoom = async (req, res) => {
  try {
    const newRoom = new Rooms(req.body);
    const savedRoom = await newRoom.save();
    res.json(savedRoom);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create a new Room' });
  }
};

// Get all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Rooms.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Rooms' });
  }
};

// Update a room by ID
const updateRoom = async (req, res) => {
  try {
    const updatedRoom = await Rooms.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the room' });
  }
};

// Delete a room by ID
const deleteRoom = async (req, res) => {
  try {
    await rooms.findByIdAndRemove(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the room' });
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
};
