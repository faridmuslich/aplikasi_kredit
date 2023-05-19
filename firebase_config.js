// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrv2XPhbxD27ivEvoN3QTqYwHn-2LcaeY",
  authDomain: "todo-47bdc.firebaseapp.com",
  projectId: "todo-47bdc",
  storageBucket: "todo-47bdc.appspot.com",
  messagingSenderId: "75603312884",
  appId: "1:75603312884:web:093f487d665bfb9c479ea1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
