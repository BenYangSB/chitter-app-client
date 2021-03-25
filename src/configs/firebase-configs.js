import firebase from 'firebase'
var firebaseConfig = {
    apiKey: "AIzaSyBCr_gY6WvYDj0NLdxpUHo7YAwgR11Tw6Y",
    authDomain: "chitter-2aadb.firebaseapp.com",
    projectId: "chitter-2aadb",
    storageBucket: "chitter-2aadb.appspot.com",
    messagingSenderId: "502561152781",
    appId: "1:502561152781:web:25bcc6c7d2d8ce0aff9a44",
    measurementId: "G-7LR8VHQYEY"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
export default firebase;