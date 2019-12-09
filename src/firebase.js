import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBTaPIfDB21tgp2z0jUNNpgB9U_85mkO4M",
    authDomain: "ecommerce-demo-1317d.firebaseapp.com",
    databaseURL: "https://ecommerce-demo-1317d.firebaseio.com",
    projectId: "ecommerce-demo-1317d",
    storageBucket: "",
    messagingSenderId: "370489039013",
    appId: "1:370489039013:web:5be09f4af1c578dbef954c",
    measurementId: "G-1J7JF577V0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // firebase.analytics();

  export default firebase;