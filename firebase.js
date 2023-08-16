// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKojF7GjpUCxIWejINDBjGDW3D_GJks80",
  authDomain: "phoneauth-9ad78.firebaseapp.com",
  projectId: "phoneauth-9ad78",
  storageBucket: "phoneauth-9ad78.appspot.com",
  messagingSenderId: "747291528106",
  appId: "1:747291528106:web:dee9352fb6d6c49cd5b9d3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage }