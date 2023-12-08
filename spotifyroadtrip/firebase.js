// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmiN2XFMd9eq5clmp_ciMP0mLQbSSq8xQ",
  authDomain: "spotify-roadtrip.firebaseapp.com",
  projectId: "spotify-roadtrip",
  storageBucket: "spotify-roadtrip.appspot.com",
  messagingSenderId: "487698594580",
  appId: "1:487698594580:web:9509ae7d522004a85ae001",
  measurementId: "G-QTP0Y44GD0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
