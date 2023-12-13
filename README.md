# 411 Project: Spotify Roadtrip

Group 5 Members: Jason Kim, Derek Laboy, Carol Riady, Izzy Handkammer, Grace Dai

Tech Stack: 
    APIs: Google Maps API, Spotify Web API
    Runtime Environment: Node.js
    Frontend: React
    Backend: Firebase
    Third Party Authentication: Spotify OAuth

If you would like to run these files on your own system, follow these instructions:

1. Install Node if you haven't already. 
2. cd into the spotifyroadtrip directory and type in the command line "npm install" to install all the dependencies.
3. Create a .env file in the spotifyroadtrip/backend and assign GOOGLE_MAPS_API_KEY your API key from the Google developer console. You will also need to get a Spotify Client ID and Client Secret, and assign them to SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET respectively in .env.
4. In spotifyLogin.js, edit the AUTH_URL const by replacing the Client ID and redirect URI with your own information. (We ran into issues that prevented us from storing the AUTH_URL in .env)
5. cd into backend and run "node server.js".
6. cd into spotifyroadtrip and run "npm start". 

Video demo: https://drive.google.com/file/d/1aTX7P-BWoIlOd3IZi-wGcd_3ilofHHgW/view?usp=sharing 
