import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {GoogleMap, useLoadScript, Marker} from '@react-google-maps/api';
import axios from 'axios';
import {Button} from '@chakra-ui/react';
import useAuth from './useAuth';
import DisplayTrack from './displayTrack';
import Select from 'react-select';
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore"; 
import { FieldValue } from 'firebase/firestore';
import {   collection, where, query, getDocs, limit, getFirestore, getDoc} from "firebase/firestore"; 

function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const firestore = getFirestore();
  const [name, setName] = useState("");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [durationTime, setDurationTime] = useState(0);
  const [tracks, setTracks] = useState([]);
  const [genreOptions, setgenreOptions] = useState();
  const [selectedGenres, setSelectedGenres] = useState(['acoustic']);
  const [email, setEmail] = useState("");
  const [plength, setPlength] = useState(0);
  const [trip, setTrip] = useState("")
  const auth = getAuth();

  useEffect(() => {
    if (!accessToken) return;
  }, [accessToken]);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // get distance and duration from Google Maps API
      const response = await axios.get(`http://localhost:8080/api/distance?departure=${departure}&arrival=${arrival}`);
      setDistance(response.data.rows[0].elements[0].distance.text);
      setDuration(response.data.rows[0].elements[0].duration.text);
      setDurationTime(response.data.rows[0].elements[0].duration.value * 1000);
    } catch (error) {
      console.error(error);
    }
    const auth = getAuth();
    if (auth.currentUser) {
      // add trip to user profile
      event.preventDefault();
      const userRef = doc(db, "users", auth.currentUser.uid);
      // add topics array to user profile in Firestore
      setDoc(userRef, {email: auth.currentUser.email, trips: `${departure} to ${arrival}` }, { merge: true })
        .then(() => {
          console.log("Trip added");
        })
        .catch((error) => {
          alert(error.message); //error message about insufficient permissions when clicking submit button
        });
    } else {
      // user not signed in
      alert("Log in to add trips.");
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setName(userDoc.data().name); // Fetch the name from Firestore
          setTrip(userDoc.data().trips);
        } else {
          setName(""); // Set name to empty string or default value if user document doesn't exist
          setTrip("no trips recently..");
        }
      } else {
        setName(""); // Clear the name when user is not logged in
        setTrip(null);
      }
      return unsubscribe;
    });

  }, []);

  useEffect(() => {
    if (!accessToken) return;

    // get available genres from Spotify API
    axios.get('http://localhost:8080/spotifyCalls/available-genre-seeds', { 'headers': { 'token': accessToken } } )
      .then(res => {
        const data = res.data;
        const genreSeeds = data.body.genres;
        setgenreOptions(genreSeeds.map(genre => ({label: [genre], value: [genre]})));
      })
      .catch(err => {
        console.log('Something went wrong!', err);
      });
    
  }, [accessToken]);

  function convertMS(ms) {
    let d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    h += d * 24;

    return  (h ? h + 'h ' : '') +  (h || m ? m + 'm ' : '') +  (m || s ? s + 's' : 's')
}

  // based on the duration of the trip, find songs that fit the duration
  function findSongs(querySize) {
    if (!durationTime) {
      window.alert("Enter a Route!");
      return
    }

    // if (!selectedGenres) {
    if (selectedGenres.length === 0) {
      window.alert("Select a Genre!");
      return;
    }
    
    // get recommendations from Spotify API
    axios.get(`http://localhost:8080/spotifyCalls/getrecommendations`, { headers: { 'token': accessToken, 'querysize': querySize, 'selectedGenres': selectedGenres } })
    .then(res => {
      const data = res.data.body.tracks;
      let playlist = [];
      let pLength = 0;
      
      for (const track of data) {
        playlist.push(track);
        pLength += track.duration_ms;

        if (pLength > durationTime) break;
      }

      console.log(pLength, durationTime);

      (pLength < durationTime) && (querySize < 100) && (playlist.length === querySize) ? 
      findSongs(querySize + 20) :
      setTracks(
        playlist.map(track => {
          const smallestAlbumImage = track.album.images.reduce( (smallest, image) => {
            if (image.height < smallest.height) return image
            return smallest
          }, track.album.images[0] );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url
          }
        })
      );
      setPlength(pLength);
    })
    .catch(err => console.log("Something went wrong!", err));
  }

  // handle genre selection
  function handleGenreSelect(e) {
    setSelectedGenres(e.map(genre => genre.value[0]));
  }

  
  return (
    <div className='appContainer'>
      <h1>Hi {name}</h1>
      <h1>Your most recent trip: {trip}</h1>
      <div className='formContainer'>
        <form onSubmit={handleSubmit}>
          <label>
            Departure:
            <input type="text" value={departure} onChange={(e) => setDeparture(e.target.value)} className="input"/>
          </label>
          <label>
            Arrival:
            <input type="text" value={arrival} onChange={(e) => setArrival(e.target.value)} className="input"/>
          </label>
          <button type="submit">Submit</button>
        </form>
        <h1>Distance: {distance}</h1>
        <h1>Duration: {duration}</h1>
        <div className='genreContainer'>
          <Select
            placeholder="Select Genres"
            isMulti
            name="genres"
            options={genreOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={e => handleGenreSelect(e)}
            />
        </div>
      </div>
      <Button onClick={() => findSongs(20)} colorScheme="green" size="md">Find Songs</Button>
      {tracks.length > 0 && <div style={{overflowy: 'auto'}} className="songs">
          <div className='trackInfo'>
            <div className='numSongs'>Number of songs: {tracks.length}</div>
            <div className='plength'>Playlist Length: {convertMS(plength)}</div>
          </div>
            {tracks.map(track => (
                <DisplayTrack track={track} key={track.uri}/>
            ))}
      </div>}
    </div>
  );
}

export default Dashboard;