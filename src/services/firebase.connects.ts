// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTw2UYNDu8tKTMT8Xy_5UWB1hDeIRi--Q",
  authDomain: "tasks-plus-11e7d.firebaseapp.com",
  projectId: "tasks-plus-11e7d",
  storageBucket: "tasks-plus-11e7d.firebasestorage.app",
  messagingSenderId: "544449543775",
  appId: "1:544449543775:web:6608ab68ee7b89ebf365ea"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db }