const mongoose = require('mongoose');
const movies = require('../movie-data-short.json');
const PersonModel = require('../models/person.model');
const MovieModel = require('../models/movie.model');




mongoose.connect('mongodb://localhost:27017/NewBase', {useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: false});


// db.createCollection("movies")
// db.createCollection("people")


//add a person to the database function
 const addPerson = async (name) =>{

    await PersonModel.findOne({name: name}).then(result => {
        if(!result){
            PersonModel.create({
                name: name,
                works:[],
                frequent:[]
            })
        }
    })
        
    
 }
 //db.collection("movies").insertOne({name: "bobby"});


    movies.forEach(c => {
                let actors = c.Actors.split(", ");
                let writers = c.Writer.split("), ");
                let genres = c.Genre.split(", " );
                let splicedWriters = [];
                let change = "";
                writers.forEach(b => {
                    if(b.includes("(")){
                        var index = b.indexOf(" (");
                        change = b.slice(0,index);
                    }
                    else{
                        change = b;
                    }
                    if(!splicedWriters.includes(change)){
                        splicedWriters.push(change);
                    }
                    
                });
                // db.collection('movies').insertOne({
                //     title: c.Title,
                //     year: c.Year,
                //     rated: c.Rated,
                //     genre: genres,
                //     released: c.Released,
                //     director: c.Director,
                //     writers: splicedWriters,
                //     actors: actors,
                //     plot: c.Plot,
                //     language:c.Language,
                //     country: c.Country,
                //     awards: c.Awards,
                //     poster: c.Poster,
                //     imdbRating: c.imdbRating,
                //     runtime: c.Runtime,
                //     ratings: c.Ratings,
                //     reviews: [],
                //     averageRating: 0,
                // })
                MovieModel.create({
                    title: c.Title,
                    year: c.Year,
                    rated: c.Rated,
                    genre: genres,
                    released: c.Released,
                    director: c.Director,
                    writers: splicedWriters,
                    actors: actors,
                    plot: c.Plot,
                    language:c.Language,
                    country: c.Country,
                    awards: c.Awards,
                    poster: c.Poster,
                    imdbRating: c.imdbRating,
                    runtime: c.Runtime,
                    ratings: [],
                    reviews: [],
                    averageRating: 0,
                })
            })

            // movies.forEach(c => {
                    
            //         addPerson(c.Director);
    
            // })

            movies.forEach(c => {
                let writers = c.Writer.split("), ");
                let allPeople = [];
                    let splicedWriters = [];
                    let change = "";
                    writers.forEach(b => {
                        if(b.includes("(")){
                            var index = b.indexOf(" (");
                            change = b.slice(0,index);
                        }
                        else{
                            change = b;
                        }
                        if(!splicedWriters.includes(change)){
                            splicedWriters.push(change);
                        }
                        
                    });
                    let actors = c.Actors.split(", ");
                    let noDupe = []

                actors.forEach(b => {
                    if(!noDupe.includes(b)){
                        noDupe.push(b);
                    }
                })

                noDupe.forEach(actor =>{
                    if(!allPeople.includes(actor)){
                        allPeople.push(actor);
                    }
                })

                splicedWriters.forEach(writer => {
                    if(!allPeople.includes(writer)){
                        allPeople.push(writer)
                    }
                })

                if(!allPeople.includes(c.Director)){
                    allPeople.push(c.Director);
                }

                allPeople.forEach(person => {
                    // db.collection("people").insertOne({
                    //     name: person,
                    //     works:[],
                    //     frequent:[]
                    // })
                    addPerson(person);
                })

                    
                
            })
            //mongoose.disconnect();
            setTimeout(() => {
                process.exit(0);
            }, 5000)
            

            //to add movies that people worked on in the database    

    



