const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    login: async (req, res) => {

        let user = await UserModel.findOne({username: req.body.username})
        let response = {message: ""};
        if(!user){
            //response.message = "A user with that name does not exist"
            return res.json({auth: false, message: "A user with that name does not exist"})
        }
        
        const isPassword =  await bcrypt.compare(
            req.body.password,
            user.password
        )

        if(!isPassword){
            //response.message = "Either username or password is incorrect"
            return res.json({auth: false, message: "Either username or password is incorrect"});
        }
       
        const id = user._id;
        const accessToken = jwt.sign({id}, process.env.SECRET, {
            expiresIn: "1d"
        })
        
        
        return res.json({auth: true, token: accessToken,user: {_id: id, name: user.username, contributing: user.isContributing, followed: user.followed, people: user.peopleFollowed}});

        
    },

    signup: async (req, res) => {
        if(req.body.username === "" || req.body.password === ""){
            res.status(204).send("No user or password");
            res.end();
        }
        let user = await UserModel.findOne({username: req.body.username});

        if(user){
            return res.json({added: false, message: "A user with this username already exists"});
        }

        req.body.password = await bcrypt.hash(req.body.password, 10)

        user = new UserModel({
            username: req.body.username,
            password: req.body.password,
            reviews: [],
            followed: [],
            peopleFollowed:[],
            isContributing: false
        })
        user.save();

        return res.json({added: true});

    },

    isTokenValid: async (req, res) => {
        try{
            const token = req.header("x-access-token");
            if(!token) return res.json({auth: false});

            const verified = jwt.verify(token, process.env.SECRET);
            if(!verified) return res.json({auth: false});

            const user = await UserModel.findById(verified.id,"username isContributing followed peopleFollowed _id" );
            if(!user) return res.json({auth: false});

            return res.json({auth: true, user});
        }
        catch(err){
            res.json({auth: false});
        }
    }
}
