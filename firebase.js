// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBFuYWpPhTzpx3c30FaZ29RZJ-ICDB6TtA",
    authDomain: "insta-clone-ai.firebaseapp.com",
    projectId: "insta-clone-ai",
    storageBucket: "insta-clone-ai.appspot.com",
    messagingSenderId: "254393983599",
    appId: "1:254393983599:web:25b34e6bbac61931b1639a"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };