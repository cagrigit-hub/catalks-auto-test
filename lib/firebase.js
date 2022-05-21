// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpAVPE7l8tQ1oVpzrEW5Ois-VCR7RpnRI",
  authDomain: "ctalks-automation-1.firebaseapp.com",
  databaseURL: "https://ctalks-automation-1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ctalks-automation-1",
  storageBucket: "ctalks-automation-1.appspot.com",
  messagingSenderId: "156451687669",
  appId: "1:156451687669:web:669c535404d151459049bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;