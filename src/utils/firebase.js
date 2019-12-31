import * as firebase from 'firebase'
let database
export const firebaseInit = () => {
  let config = {
    apiKey: "AIzaSyB_C-FwLU98mRdtZdjD-McOQnxbmthI0Rw",
    authDomain: "react-budget-b38c7.firebaseapp.com",
    databaseURL: "https://react-budget-b38c7.firebaseio.com",
    projectId: "react-budget-b38c7",
    storageBucket: "react-budget-b38c7.appspot.com",
    messagingSenderId: "756798029372"
  }
  firebase.initializeApp(config)
  database = firebase.database()
}