import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcKFzKp0X1UKYYI58GUF2pM0Mz7UNpMRk",
  authDomain: "vueexpensetracker.firebaseapp.com",
  projectId: "vueexpensetracker",
  storageBucket: "vueexpensetracker.appspot.com",
  messagingSenderId: "326142887206",
  appId: "1:326142887206:web:eec7f76b77af0cb4b02de7",
  measurementId: "G-V1033YFS8L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
