const { Schema, model } = require("mongoose");

const RoomSchema = new Schema({
    Room_id: { type: String, unique: true, default: "-" },
    name: { type: String, default: "-" }
});

const Rooms = model("Rooms", RoomSchema, "Rooms");
module.exports = Rooms;
    