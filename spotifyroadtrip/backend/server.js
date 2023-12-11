require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET; 
const spotifyCalls = require('./routes/spotifyCalls');

app.use('/spotifyCalls', spotifyCalls);

app.post('/spotify/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: spotifyClientId,
        clientSecret: spotifyClientSecret,
        refreshToken: refreshToken
    });

    spotifyApi.refreshAccessToken()
    .then(data => {
        res.json({
            accessToken: data.body.access_token,
            expiresIn: data.body.expires_in
        });
    }).catch((err) => {
        console.log(err);
        res.sendStatus(400);
    });
});

app.post('/spotify/login', (req, res) => {
    const code = req.body.code;

    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000/dashboard',
        clientId: spotifyClientId,
        clientSecret: spotifyClientSecret
    });
    // console.log(code);
    spotifyApi.authorizationCodeGrant(code)
    .then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        });
    }).catch((err) => {
        console.log(err);
        res.sendStatus(400);
    });
});

