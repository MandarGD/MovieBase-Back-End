const mongoose = require('mongoose');

let reviewSchema = mongoose.Schema(
    {
        user: String,
        movieId: String,
        rating: Number,
        summary: String,
        body: String,
        title: String
    }
)

const register = mongoose.model('Review', reviewSchema);
module.exports = register;