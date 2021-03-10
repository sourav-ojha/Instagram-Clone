import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp(
  {
     apiKey: "AIzaSyAShdlbtdMQYCZ8eN8GRpKMmS0BDx2yfUM",
     authDomain: "instagram-clone-b5a6b.firebaseapp.com",
     projectId: "instagram-clone-b5a6b",
     storageBucket: "instagram-clone-b5a6b.appspot.com",
     messagingSenderId: "379915949863",
     appId: "1:379915949863:web:7427d609a678b65365fb02",
     measurementId: "G-YRSCT4Q7SY"
   }
); 

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };

  // export default db;