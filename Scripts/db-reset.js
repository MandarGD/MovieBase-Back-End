//const mongoose = require('mongoose');
// const movies = require('../movie-data-short.json');
// const PersonModel = require('../models/person.model');
// const MovieModel = require('../models/movie.model');

//const { db } = require("../models/movie.model");



    // mongoose.connect('mongodb://localhost:27017/TestMovieBase', {useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: false});

    // let db = mongoose.connection;

    // db.dropCollection('movies');
    // db.dropCollection('people');

    db = connect('mongodb://localhost:27017/NewBase');

    db.movies.drop();
    db.people.drop();
    db.users.drop();
    db.reviews.drop();

    






