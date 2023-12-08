const express = require('express');
const axios = require('axios');
const SpotifyWebApi = require('spotify-web-api-node');

//create a router in express
const router = express.Router();

router.get('/getrecommendations/', (req, res) => {
    const token = req.headers.token;
    const qSize = req.headers.querysize;
    const genres = req.headers.selectedgenres;

    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        accessToken: token
      });

    spotifyApi.getRecommendations({
        limit: qSize,
        // min_energy: 0.4,
        seed_genres: genres,
        // min_popularity: 10
    })
    .then(data => {
        res.json(data);
    }).catch((err) => {
        console.log(err);
        res.sendStatus(400);
    });
});



router.get('/available-genre-seeds/', (req, res) => {
    const token = req.headers.token;

    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        accessToken: token
        });

    spotifyApi.getAvailableGenreSeeds()
    .then(data => {
        res.json(data);
    }).catch((err) => {
        console.log(err);
        res.sendStatus(400);
    });
});

module.exports = router;
