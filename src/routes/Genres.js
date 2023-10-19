const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Genres = require('../Model/GenresForm.js');

const app = express();
app.db = mongoose.connect(
    'mongodb+srv://zidanalfariza:fYHwnm5hg23arMn4@cluster0.5vzcaw6.mongodb.net/Tickets',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => {
    console.log("Databases Connected")
}).catch((err) => {
    console.log(err);
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/genre', async (req, res) => {
    // To post
    const { name, genre_id } = req.body;
    const data = await Genres.findOne({ name });
    console.log(data);
    if(!data){
        console.log("Tidak Ditemukan")
        const newGenres = new Genres({genre_id, name})
        await newGenres.save();
        res.json("Data Berhasil Di Simpan");
    }else{
        res.json("Data Sudah Ada");
    }
})

app.listen(3090, () => console.log("Listening To : 3090"));
app.post("/add-user", (req, res) => InsertUser(req, res));