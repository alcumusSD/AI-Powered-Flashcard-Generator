import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "",
  authDomain: "flashcardmaker-23744.firebaseapp.com",
  projectId: "flashcardmaker-23744",
  storageBucket: "flashcardmaker-23744.appspot.com",
  messagingSenderId: "457685447215",
  appId: "1:457685447215:web:f1c575054c2cee2895ccda",
  measurementId: "G-WYLX6HQ8Y0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);