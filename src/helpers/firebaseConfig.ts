// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBPMp5l_AJQJcimVLxeYNaJXOQPKgkXKEA',
  authDomain: 'pomodaybe.firebaseapp.com',
  projectId: 'pomodaybe',
  storageBucket: 'pomodaybe.appspot.com',
  messagingSenderId: '1069715670196',
  appId: '1:1069715670196:web:bf2473c95bc878934083e1',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
