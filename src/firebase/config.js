// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUrZxCP6_FGzuU3bur7MzyF8iinCJnz-c",
  authDomain: "taskflorent.firebaseapp.com",
  projectId: "taskflorent",
  storageBucket: "taskflorent.firebasestorage.app",
  messagingSenderId: "550200030488",
  appId: "1:550200030488:web:9e49222991999718c99a6d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;