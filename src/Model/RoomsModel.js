const { Schema, model } = require("mongoose");

const RoomSchema = new Schema({
    room_id: { type: String, unique: true, default: "-" },
    name: { type: String, default: "-" },
    total_seat: {type: Number, default: 0}
});

const Rooms = model("rooms", RoomSchema, "rooms");
module.exports = Rooms;