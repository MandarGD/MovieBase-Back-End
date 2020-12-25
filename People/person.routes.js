const express = require('express');
const { verifyJwt } = require('../middleware/token-ver');
const PersonModel = require('../models/person.model');
const mongoose = require('mongoose');
const MovieModel = require("../models/movie.model");

const router = express.Router();

router.get("/people", async(req, res) => {//add verify jwt
    let name = req.query.name;
    if(!name){
        name="";
        let results = await PersonModel.find({});
        res.json(
            results
        )
    }
    else{
        let results = await PersonModel.find({name: {$regex: "^" + name + "$" , $options:'i'}})

        res.json(results);
    }

    
})

router.get("/:person",async (req, res) => { //add verify jwt
    let person = await PersonModel.findById(req.params.person)

    res.json({auth: true, person: person});
})

router.post("/addPerson", async(req, res) => {

    let results = await PersonModel.find({name: {$regex:"^" + req.body.name + "$", $options: 'i'}})
    if(results.length === 0){
        PersonModel.create({
            name: req.body.name,
            works:[],
            frequent:[]
        })
        res.json({auth: true, message: "added"});
    }
    else{
        res.json({auth: true, message: "not added"});
    }
    
    
})

router.get("/getWorks/:name", verifyJwt, async(req, res) => {
    let results = await MovieModel.find({$or:[{director: {$regex:"^" + req.params.name + "$", $options:"i"}}, {writers: {$regex:"^" + req.params.name + "$", $options:"i"}}, {actors: {$regex:"^" + req.params.name + "$", $options:"i"}} ]})
    res.json({auth: true, results: results});
})


module.exports = router;