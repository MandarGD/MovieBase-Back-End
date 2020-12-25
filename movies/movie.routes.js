const MovieModel = require('../models/movie.model');
const PersonModel = require('../models/person.model');
const UserModel = require('../models/user.model');
const express = require('express');
const { verifyJwt } = require('../middleware/token-ver');
const router = express.Router();


router.get('/' ,async(req, res) => {
    let title = req.query.title;
    let genre = req.query.genre;
    let year = req.query.year;
    let minRating = req.query.minRating;
    if(!title){
        title = "";
    }

    if(!genre){
        genre="";
    }

    if(!year){
        year="";
    }

    if(!minRating){ //figure out how to sotre an avg rating
        minRating = 0;
    }

    results = await MovieModel.find({title:{$regex: title, $options:'i'}, genre: {$regex: genre, $options:'i'}, year:{$regex: year, $options:'i'}, averageRating:{$gte: minRating}})

    res.json({
        results
    })
    
   
})

router.get('/recMovies', verifyJwt, async(req, res) => {
    UserModel.findById(req.userId, "peopleFollowed").then(result => {
        if(result.peopleFollowed.length > 0){
            let len = result.peopleFollowed.length - 1;

            MovieModel.find({$or:[{actors: result.peopleFollowed[len]}, {director: result.peopleFollowed[len]}, {writers: result.peopleFollowed[len]}]}).then(c => {
                res.json(
                    {auth: true, movies: c}
                )
            })
        }
        else{
            let array= [];
            res.json(
                {auth: true, movies: array}
            )
        }
        
    })
    

    
})

router.get('/similarMovies/:id', async(req, res) => {
    MovieModel.findById(req.params.id).then(result => {
        let reqGenre = result.genre[0];

        MovieModel.find({$and: [{genre: reqGenre}, {_id:{$ne : req.params.id}}]}).then(c => {
            res.json(
                c
            )
        })
        

    })
})
router.post('/addMovie', verifyJwt,async(req, res) => {
    console.log(req.body);
    let people = [];
    let writers = req.body.writers.split(", ");
    let actors = req.body.actors.split(", ");
    let message = "could not find person";
    var unfound = [];
    people.push(...writers);
    people.push(...actors);
    people.push(req.body.director);

    for(let i = 0; i < people.length; i++){
            let person = await PersonModel.findOne({name: {$regex: "^" + people[i] + "$", $options:'i'}});
            if(!person){
                unfound.push(people[i]);
            }
    }
    
    
    console.log(people);
    console.log(unfound);
    
    if(unfound.length !== 0 ){
        res.json({auth: true, message:message + " " + unfound});
    }
    else{
        let genres = req.body.genre.split(" ");
        await MovieModel.create({
            title: req.body.title,
            year: req.body.year,
            genre: genres,
            director: req.body.director,
            writers: writers,
            actors: actors,
            plot: req.body.plot,
            poster: req.body.poster,
            imdbRating: req.body.imdb,
            runtime: req.body.runtime,
        })

        let movie = await MovieModel.findOne({title: req.body.title});

        for(let i = 0; i < people.length; i++){
            await PersonModel.findOneAndUpdate({name: {$regex: "^" + people[i] + "$", $options:'i'}}, {$push:{works: movie._id}});
            
        }

        res.json({auth: true, message:"Added the movie"});
    }
    
    res.end();
})

router.post('/', async(req, res) => {

    console.log(req.body);
    let people = [];
    let writers = req.body.writers.split(", ");
    let actors = req.body.actors.split(", ");
    let message = "could not find person";
    var unfound = [];
    people.push(...writers);
    people.push(...actors);
    people.push(req.body.director);

    for(let i = 0; i < people.length; i++){
            let person = await PersonModel.findOne({name: {$regex: "^" + people[i] + "$", $options:'i'}});
            if(!person){
                unfound.push(people[i]);
            }
    }
    
    
    console.log(people);
    console.log(unfound);
    
    if(unfound.length !== 0 ){
        res.json({auth: true, message:message + " " + unfound});
    }
    else{
        let genres = req.body.genre.split(" ");
        await MovieModel.create({
            title: req.body.title,
            year: req.body.year,
            genre: genres,
            director: req.body.director,
            writers: writers,
            actors: actors,
            plot: req.body.plot,
            poster: req.body.poster,
            imdbRating: req.body.imdb,
            runtime: req.body.runtime,
        })

        let movie = await MovieModel.findOne({title: req.body.title});

        for(let i = 0; i < people.length; i++){
            await PersonModel.findOneAndUpdate({name: {$regex: "^" + people[i] + "$", $options:'i'}}, {$push:{works: movie._id}});
            
        }

        res.json({auth: true, message:"Added the movie"});
    }
    
    res.end();
})



router.get('/allmovies',verifyJwt ,async(req, res) => {
    let found = await MovieModel.find({}, "_id title imdbRating poster runtime year ratings");
    //console.log(found);
    res.json({auth: true, movies: found});
    res.end();
})

router.get('/:movie',async(req, res) => {
    let found = await MovieModel.findById(req.params.movie);
    res.json({movie: found});
    res.end();
})
router.get('/auth/:movie', verifyJwt ,async(req, res) => {
    let found = await MovieModel.findById(req.params.movie);
    res.json({auth: true, movie: found});
    res.end();
})

router.get('/:type?/:param?',verifyJwt ,async(req, res) => {
    const t = req.params.type;
    let search = req.params.param;
    let found = "";
    if(!t){
        found = MovieModel.find({}, "_id title imdbRating poster runtime year ");
    }


    if(t === "genre"){
        found = await MovieModel.find({genre: {$regex: search, $options:'i'}}, "_id title imdbRating poster runtime year ");
    }

    if(t === "title"){
        found = await MovieModel.find({title: {$regex: search, $options:'i'}}, "_id title imdbRating poster runtime year ");
    }

    if(t === "year"){
        found = await MovieModel.find({year: {$regex: search, $options:'i'}}, "_id title imdbRating poster runtime year ");
    }

    if(t === "writer"){
        found = await MovieModel.find({writers: {$regex: search, $options:'i'}}, "_id title imdbRating poster runtime year ");
    }
    if(t === "actor"){
        found = await MovieModel.find({actors: {$regex: search, $options:'i'}}, "_id title imdbRating poster runtime year ");
    }
    if(t === "director"){
        found = await MovieModel.find({director: {$regex: search, $options:'i'}}, "_id title imdbRating poster runtime year ");
    }

    // if(t === "minrating"){
    //     //TODO
    // }
    
    res.json({auth: true, movies: found});
    res.end();
})





module.exports = router;

