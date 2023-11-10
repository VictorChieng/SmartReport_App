import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore";
import 'firebase/storage';



const app = firebase.initializeApp({
  apiKey: "AIzaSyCujMcbsFY4leYE-q2lQG_Cm9eMRD_PWRk",
  authDomain: "smartreport-272fa.firebaseapp.com",
  projectId: "smartreport-272fa",
  storageBucket: "smartreport-272fa.appspot.com",
  messagingSenderId: "769752664985",
  appId: "1:769752664985:web:46b0c0ab3528c3b9b5e108",
  measurementId: "G-WWHMBE29LT"
  
});

export const auth = app.auth()
export const firestore = firebase.firestore();
const storage = app.storage();


export {  storage, firebase as default };
