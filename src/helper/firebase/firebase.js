import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAUp0YDVYZPFtsPQw3jSTwPmNn2D4mb6Z8",
  authDomain: "writeqoute.firebaseapp.com",
  databaseURL: "https://writeqoute.firebaseio.com",
  projectId: "writeqoute",
  storageBucket: "writeqoute.appspot.com",
  messagingSenderId: "8639238319",
  appId: "1:8639238319:web:7f0bb00734cacd0002045a",
  measurementId: "G-9W1XYD8697"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // firebase.analytics();
  export default firebase;