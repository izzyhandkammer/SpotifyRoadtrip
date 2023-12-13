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
      event.preventDefault();
      const userRef = doc(db, "users", auth.currentUser.uid);
      // add topics array to user profile in Firestore
      setDoc(userRef, {email: auth.currentUser.email }, { merge: true })
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
        } else {
          setName(""); // Set name to empty string or default value if user document doesn't exist
        }
      } else {
        setName(""); // Clear the name when user is not logged in
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
    <div className='appContainer' style={{ backgroundColor: '#000', fontFamily: 'Circular, sans-serif', color: '#fff' }}>
      <h1 style={{ fontSize: '2em', marginBottom: '0' }}>Hi {name}</h1>
      <div className='formContainer' style={{ margin: '0 auto 3em', width: '80%', maxWidth: '1200px' }}>
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', margin: '1em 0', fontWeight: 'bold', fontSize: '1.2em' }}>
            Start:
            <input type="text" value={departure} onChange={(e) => setDeparture(e.target.value)} className="input" style={{ margin: '1em 0', padding: '0.5em', fontWeight: 'bold', width: '100%', color: '#fff' }}/>
          </label>
          <label style={{ display: 'block', margin: '1em 0', fontWeight: 'bold', fontSize: '1.2em' }}>
            Destination:
            <input type="text" value={arrival} onChange={(e) => setArrival(e.target.value)} className="input" style={{ margin: '1em 0', padding: '0.5em', fontWeight: 'bold', width: '100%', color: '#fff' }}/>
          </label>
          <h1 style={{ fontSize: '1.2em', margin: '2em 0', fontWeight: 'bold' }}>Distance: {distance}</h1>
          <h1 style={{ fontSize: '1.2em', margin: '2em 0', fontWeight: 'bold' }}>Duration: {duration}</h1>
          <div style={{ textAlign: 'center', margin: '2em 0' }}>
            <button type="submit" style={{ padding: '0.5em 1em', fontSize: '1em', fontWeight: 'bold', borderRadius: '5px', cursor: 'pointer', border: 'none', backgroundColor: '#1DB954', color: '#fff' }}>Process Trip</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1em 0' }}>
            <div style={{ flex: '1 1 auto' }}>
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
            <button type="button" onClick={() => findSongs(20)} style={{
              padding: '0.5em 1em',
              fontSize: '1em',
              fontWeight: 'bold',
              borderRadius: '5px',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: '#1DB954',
              color: '#fff',
              marginLeft: '1em' // Add some space between the select and the button
            }}>
              Find Songs
            </button>
          </div>
        </form>
      </div>
      {tracks.length > 0 && <div style={{ overflowY: 'auto', margin: '3em 0' }} className="songs">
        <div className='trackInfo' style={{ margin: '2em 0' }}>
          <div className='numSongs' style={{ fontSize: '1em', fontWeight: 'bold' }}>{tracks.length} Songs</div>
          <div className='plength' style={{ fontSize: '1em', fontWeight: 'bold' }}>Total Runtime {convertMS(plength)}</div>
        </div>
        {tracks.map(track => (
          <DisplayTrack track={track} key={track.uri}/>
        ))}
      </div>}
    </div>
  );
  
  
}

export default Dashboard;