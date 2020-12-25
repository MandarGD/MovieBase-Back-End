const mongoose = require('mongoose');
const movies = require('../movie-data-short.json');
const PersonModel = require('../models/person.model');
const MovieModel = require('../models/movie.model');



mongoose.connect('mongodb://localhost:27017/NewBase', {useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: false});

let db = mongoose.connection;


    PersonModel.find({}).then(result => {
        result.forEach(c => {
            MovieModel.find({$or:[{director:{$regex: c.name, $options:'i'}}, {actors: {$regex: c.name, $options:'i'}}, {writers: {$regex: c.name, $options:'i'}}]}).then(movie => {
                movie.forEach(b => {
                    PersonModel.findOneAndUpdate({_id: c._id}, {$push:{works: b._id}}).then(res => {
                        
                    })
                
                })
            })
            
        })
    })

    setTimeout(() => {
        process.exit(0);
    }, 5000)
