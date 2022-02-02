import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBAS3M_1Po96p_rarssROLVneHEcy_ATPk",
  authDomain: "v-mess.firebaseapp.com",
  projectId: "v-mess",
  storageBucket: "v-mess.appspot.com",
  messagingSenderId: "762268376657",
  appId: "1:762268376657:web:ee46289057c07e57a42270"
};

const connection = firebase.initializeApp(firebaseConfig);

export default connection.firestore();