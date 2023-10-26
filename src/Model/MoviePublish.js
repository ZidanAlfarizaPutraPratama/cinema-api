const mongoose = require('mongoose');
const { Schema, model } = mongoose;

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
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
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
        this.no_publish = generateUniqueNoPublish();
        const existingMoviePublish = await MoviePublish.findOne({ no_publish: this.no_publish });
        if (existingMoviePublish) {
        this.no_publish = generateUniqueNoPublish();
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

function generateUniqueNoPublish() {
 uniqueValue;
}


const MoviePublish = model("moviePublishes", MoviePublishSchema, "moviePublishes");
module.exports = MoviePublish;
