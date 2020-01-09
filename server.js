const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const MOVIESDATA = require('./movies-data-small.json');
const PORT = 8000;

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(validateBearerToken);

app.get('/movie', handleGetMovies)

function validateBearerToken(req, res, next) {
    const reqAuthToken = req.get('Authorization');
    const neededToken = process.env.API_TOKEN;

    if (!reqAuthToken || reqAuthToken.split(" ")[1] !== neededToken) {
        return res.status(401).json({error:'Ah ah ah, you didn\'t say the magic word'});
    }
    next();
}

function handleGetMovies(req, res) {
    let response = MOVIESDATA   

    if(req.query.genre) {
        response = response.filter(MOVIESDATA => {
         return  MOVIESDATA.genre.toLowerCase().includes(req.query.genre.toLowerCase()); 
        });
    };

    if(req.query.country) {
        response = response.filter(MOVIESDATA => {
            return MOVIESDATA.country.toLowerCase().includes(req.query.country.toLowerCase());
        });
    };

    if(req.query.avg_vote) {
        response = response.filter(MOVIESDATA => {
            return parseFloat(MOVIESDATA.avg_vote) >= parseFloat(req.query.avg_vote);
        })
    }

    res.json(response)
}

app.listen(PORT, () => {
    console.log(`server is runnig at http://localhost:${PORT}`);
});