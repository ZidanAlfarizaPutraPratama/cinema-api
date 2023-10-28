const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const moment = require('moment');
moment.locale('id');

const MoviePublishSchema = new Schema({
  no_publish: {
    type: String,
    required: true,
    unique: true,
  },
  movie_id: {
    type: String,
    required: true,
  },
  room_id: {
    type: String,
    required: true,
  },
  available_seat: {
    type: [String],
    required: true,
  },
  start_time: {
    type: String,
    required: true,
  },
  end_time: {
    type: String,
    required: true,
  },
  is_ended: {
    type: Boolean,
    required: true,
  },
});

MoviePublishSchema.pre('save', async function (next) {
  try {
    if (!this.no_publish) {
      this.no_publish = `MP-${Date.now()}`;
      const existingMoviePublish = await model('moviePublishes').findOne({ no_publish: this.no_publish });
      if (existingMoviePublish) {
        this.no_publish = `MP-${Date.now()}`;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

const MoviePublish = model("moviePublishes", MoviePublishSchema, "moviePublishes");
module.exports = MoviePublish;
