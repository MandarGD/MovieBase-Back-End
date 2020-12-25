const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authRouter = require('./auth/auth.routes');
const userRouter = require('./users/user.routes');
const reviewRouter = require("./reviews/review.routes");
const peopleRouter = require("./People/person.routes");
const movieRouter = require('./movies/movie.routes');
const path = require('path');

require('dotenv').config()

const app = express();

mongoose.connect('mongodb://localhost:27017/NewBase', {useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: false});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/static', express.static(path.join(__dirname, '../moviebase-client/build/static')));



app.listen(3000);
app.use('/auth', authRouter);
app.use('/movies', movieRouter);
app.use('/users', userRouter);
app.use('/reviews', reviewRouter);
app.use('/people', peopleRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../moviebase-client/build/index.html'));
    
})
