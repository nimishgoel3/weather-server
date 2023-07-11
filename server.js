require('dotenv').config();
const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
// mongoose.connect('mongodb://localhost:27017/weatherApp', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://dbuser:Abc%401234@cluster0.vlgbwew.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
// process.env.MONGO_CONNECTION_STRING

const CitySchema = new mongoose.Schema({
  name: String,
  searches: Number,
});

const City = mongoose.model('City', CitySchema);
const WEATHER_API_KEY = '3ee9d7c9078b1d80b7a774b6482e680c'
app.use(express.json());

app.get('/api/weather/:city', async (req, res) => {
  try {
    const { data } = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&appid=${WEATHER_API_KEY}`);
    let city = await City.findOne({ name: req.params.city });

    if (city) {
      city.searches += 1;
    } else {
      city = new City({ name: req.params.city, searches: 1 });
    }

    await city.save();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(5001, () => console.log('Server started on port 5001'));
