import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/storage';
// import firebase from 'firebase';
// import 'firebase/storage'; 

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAWX61CV1pr5j9CQjnW9GjGq4f99et7pl4",
    authDomain: "portal-7688d.firebaseapp.com",
    projectId: "portal-7688d",
    storageBucket: "portal-7688d.appspot.com",
    messagingSenderId: "775255237192",
    appId: "1:775255237192:web:6566549c0f62e12f53ee7d",
    measurementId: "G-F92PSNBVCW"
  };
  

  export const Firebase= firebase.initializeApp(firebaseConfig)