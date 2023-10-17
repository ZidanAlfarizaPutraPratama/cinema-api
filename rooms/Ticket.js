const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataFilm = require('./models/DataFilms.js');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/film_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.post('/check', (req, res) => {
  const { name, total_seat } = req.body;
  FormDataFilm.findOne({ name: name, total_seat: total_seat })
    .then(result => {
      if (result) {
        res.json("Kursi anda tersedia.");
      } else {
        res.json("Kursi anda tidak tersedia.");
      }
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

app.listen(3001, () => {
  console.log("Server listening on http://127.0.0.1:3001");
});
