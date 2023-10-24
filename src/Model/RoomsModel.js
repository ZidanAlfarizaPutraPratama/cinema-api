const { Schema, model } = require("mongoose");

const RoomSchema = new Schema({
    room_id: { type: String, unique: true, default: "-" },
    name: { type: String, default: "-" }
});

const Rooms = model("rooms", RoomSchema, "rooms");
module.exports = Rooms;
    