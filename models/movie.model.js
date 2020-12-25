const mongoose = require('mongoose');

let movieSchema = mongoose.Schema(
    {
        title: String,
        year: String,
        rated: String,
        genre: [String],
        
        director: String,
        writers: [String],
        actors:[String],
        plot: String,
        language: String,
        country: String,
        poster: String,
        imdbRating: String,
        runtime: String,
        ratings: [Number],
        reviews: [String],
        averageRating:Number,


    }

)

const register = mongoose.model('movie', movieSchema);
module.exports = register;