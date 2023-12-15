// database/firebaseDb.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCz0UBIPIUCQDNNMmYxfQiiC_Ldwx2wwv0",
    authDomain: "tsu-study-app.firebaseapp.com",
    databaseURL: "https://tsu-study-app-default-rtdb.firebaseio.com",
    projectId: "tsu-study-app",
    storageBucket: "tsu-study-app.appspot.com",
    messagingSenderId: "681904911747",
    appId: "1:681904911747:web:132e14cb9a7056440672b6",
    measurementId: "G-XPSFN16ZHX"
  };
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
export const auth = getAuth(app);