const express = require("express");
const UserModel = require("../models/user.model");
const {verifyJwt} = require("../middleware/token-ver");
const MovieModel = require('../models/movie.model');
const ReviewModel = require("../models/review.model");
const mongoose = require('mongoose');
const router  = express.Router();

router.post('/addReview/:movieId/:title' ,verifyJwt ,async(req,res) => {
    console.log(req.params.movieId);
    
    let review = await ReviewModel.create({
        user: req.body.userId,
        movieId: req.params.movieId,
        rating: req.body.rating,
        summary: req.body.summary,
        body: req.body.body,
        title: req.params.title
    })

    await MovieModel.findById(req.params.movieId).then(result => {
        let total = 0;
        result.ratings.forEach(element => {
            total+= element
        });

        total += parseInt(req.body.rating);

        total = Math.floor( total/(result.ratings.length + 1));

        MovieModel.findByIdAndUpdate(req.params.movieId, {averageRating: total}).then(resp => {
            console.log("updated");
        });
    })

    await MovieModel.findByIdAndUpdate(req.params.movieId, {$push:{ratings: req.body.rating}}).then(result => {
        res.json({auth: true, message: "review added"});
    })

    console.log(review);
    
    

});

router.get('/getReviews/:movieId?' ,async(req, res) => {
    if(!req.params.movieId){
        let reviews = await ReviewModel.find();
        res.json({auth: true, reviews});
    }
    else{
        let reviews = await ReviewModel.find({movieId: req.params.movieId});
        res.json({auth: true, reviews});
    }

    
    res.end();
})

router.get("/userReviews/:id",verifyJwt ,async(req, res) => {
    let userReviews = await ReviewModel.find({user: req.params.id});

    res.json({auth: true, userReviews: userReviews});

})


module.exports = router