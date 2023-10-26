const Rooms = require('../Model/RoomsModel');

const createRoom = async (req, res) => {
  const { room_id, name } = req.body;

  try {
    const existingRoom = await Rooms.findOne({ room_id });

    if (!existingRoom) {
      const newRoom = new Rooms({ room_id, name });
      const savedRoom = await newRoom.save();
      res.status(201).json({ message: "Data Berhasil Disimpan", room: savedRoom });
    } else {
      res.status(400).json({ error: "Data Ada" }); // Wrap in an object with "error" key
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Terdapat kesalahan" }); // Correct the response format
  }
};

// Get all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Rooms.find();
    res.json(rooms);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Terdapat kesalahan dalam mengambil data room" });
  }
};

// Update a room by room_id
const updateRoom = async (req, res) => {
  const { room_id } = req.params;
  const { name } = req.body;
  try {
    const room = await Rooms.findOneAndUpdate(
      { room_id },
      { name },
      { new: true }
    );
    if (room) {
      res.json({ message: "Data update", room });
    } else {
      res.status(404).json({ error: "Data Tidak Ditemukan" }); 
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Terdapat kesalahan dalam memperbarui data room" });
  }
};

//Delete room ID
const deleteRoom = async (req, res) => {
  const { room_id } = req.params;
  try {
    const room = await Rooms.findOneAndDelete({ room_id: room_id });
    if (room) {
      res.json("Data Berhasil Dihapus");
    } else {
      res.status(404).json({ error: "Data Tidak Ditemukan" }); 
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Terdapat kesalahan dalam menghapus data room" });
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
};
