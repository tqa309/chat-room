import firebase from "firebase/compat/app";

import "firebase/compat/analytics";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAQaT4-8t6uQ0d07bzWlNPD7rPvpCp1QGY",
    authDomain: "chatroom-81cd7.firebaseapp.com",
    projectId: "chatroom-81cd7",
    storageBucket: "chatroom-81cd7.appspot.com",
    messagingSenderId: "1027833064127",
    appId: "1:1027833064127:web:b8895ea9eb329b99c7b40a",
    measurementId: "G-JSXX2Z508K",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

auth.useEmulator("http://localhost:9099");
if (window.location.hostname === "localhost") {
    db.useEmulator("localhost", "8080");
}

export { db, auth };
export default firebase;
