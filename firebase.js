import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAGCk0o2G4sqKjutWcHPf5GO-2qsKKjhWw",
  authDomain: "signal-clone-71a42.firebaseapp.com",
  projectId: "signal-clone-71a42",
  storageBucket: "signal-clone-71a42.appspot.com",
  messagingSenderId: "927347466627",
  appId: "1:927347466627:web:0e196bfff62132192b16b6",
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
