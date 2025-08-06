// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAU7-h00-HzFFuFhzfelSTTj4nHd6sh9Wc",
  authDomain: "prepwise-ac6ba.firebaseapp.com",
  projectId: "prepwise-ac6ba",
  storageBucket: "prepwise-ac6ba.firebasestorage.app",
  messagingSenderId: "128648868568",
  appId: "1:128648868568:web:665ba18e4d04246f92ddad",
  measurementId: "G-MR76WYTQ5J",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
