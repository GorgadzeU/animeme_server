const mongoose = require('mongoose');

const animeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    requied: true,
  },
  genres: {
    type: Array,
    required: true,
  },
  mainImage: {
    type: String,
    required: true,
  },
  backImage: {
    type: String,
    required: true,
  },
  episodes: {
    type: Array,
  },
});

const Anime = mongoose.model('Anime', animeSchema);

module.exports = Anime;
