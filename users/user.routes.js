
const UserModel = require('../models/user.model');
const express = require('express');
const router = express.Router();
const {verifyJwt} = require('../middleware/token-ver');

router.get('/user',async (req, res) => {
    let name = req.query.name;
    if(!name){
        name = "";
    }

    let results = UserModel.find({username: {$regex: name, $options:'i'}})
    res.json(results);
})


router.get('/getUserName/:userId', async(req, res) => {
    let user = await UserModel.findById(req.params.userId, "username");
    res.json(user);
    res.end();
})

router.get('/followUser/:id',verifyJwt ,async (req, res) => {
    let user = await UserModel.findById(req.params.id);
    //user.followed.includes(req.userId);
    if(user.followed.includes(req.userId)){
        res.json({auth: true, message: "You already follow this user"});
    }
    else if(id !== req.userId){
        res.json({auth : true, message: "Can't follow yourself"});
    }
    else{
        
        await UserModel.findByIdAndUpdate(req.params.id, {$push:{followed: req.userId}});
        res.json({auth: true, message:"You have followed this user"});
    }

})

router.get('/unfollowUser/:id',verifyJwt ,async (req, res) => {
    let user = await UserModel.findById(req.params.id);
    //user.followed.includes(req.userId);
    if(!user.followed.includes(req.userId)){
        res.json({auth: true, message: "You do not follow this user"});
    }
    else{
        
        await UserModel.findByIdAndUpdate(req.params.id, {$pull:{followed: req.userId}});
        res.json({auth: true, message:"You have unfollowed this user"});
    }

})

router.get('/followPerson/:name',verifyJwt, async(req, res) => {
    let user = await UserModel.findById(req.userId);
    if(user.peopleFollowed.includes(req.params.name)){
        res.json({auth: true, message: "You already follow this person"});
    }
    else{
        await UserModel.findByIdAndUpdate(req.userId, {$push:{peopleFollowed: req.params.name}});
        res.json({auth: true, message: "You have followed this person"})
    }
})

router.get('/unfollowPerson/:name',verifyJwt, async(req, res) => {
    let user = await UserModel.findById(req.userId);
    if(!user.peopleFollowed.includes(req.params.name)){
        res.json({auth: true, message: "You don't follow this person"});
    }
    else{
        await UserModel.findByIdAndUpdate(req.userId, {$pull:{peopleFollowed: req.params.name}});
        res.json({auth: true, message: "You have unfollowed this person"})
    }
})

router.get('/getFollowedUsers',verifyJwt ,async(req, res) => {
    
    let usersFollowed = await UserModel.find({followed: req.userId}, "username");
    res.json({auth: true, usersFollowed: usersFollowed});
   

   res.end();
    
    
})

router.get('/getFollowedUsers/:id',verifyJwt ,async(req, res) => {
    
    let usersFollowed = await UserModel.find({followed: req.params.id}, "username");
    res.json({auth: true, usersFollowed: usersFollowed});
   

   res.end();
    
    
})

router.get('/getFollowedPeople', verifyJwt, async(req, res) => {
    let people = await UserModel.findById(req.userId, "peopleFollowed");
    res.json({auth: true, people: people});
})

router.get('/getFollowedPeople/:id', verifyJwt, async(req, res) => {
    let people = await UserModel.findById(req.params.id, "peopleFollowed");
    res.json({auth: true, people: people});
})

router.get('/:userid',async(req, res) => {
    if(req.params.userid){
        let user = await UserModel.findOne({_id : req.params.userid});
        res.json({auth: true, user: user});
    }
    res.end();
})

router.get("/", async (req, res) => {
    let username = req.query.name;
    if(!username){
        username="";
        let results = await UserModel.find({});
        res.json(
            results
        )
    }
    else{
        let results= await UserModel.find({username:{$regex: "^" + username + "$" , $options:'i'}});

        res.json(results);
    }

    
})




module.exports = router;