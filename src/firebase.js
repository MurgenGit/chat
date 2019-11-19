import firebase from 'firebase/app'
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBqUk7uC3T7XnArLlPWzshBOZSsPmNIn5M",
  authDomain: "chat-app-19b45.firebaseapp.com",
  databaseURL: "https://chat-app-19b45.firebaseio.com",
  projectId: "chat-app-19b45",
  storageBucket: "chat-app-19b45.appspot.com",
  messagingSenderId: "580093043935",
  appId: "1:580093043935:web:6dea53bb7700f95a0e756a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()
const rtdb = firebase.database()
export function setupPresence(user) {
  const isOfflineForRTDB = {
    state: 'offline',
    lastChanged: firebase.database.ServerValue.TIMESTAMP
  }
  const isOnlineForRTDB = {
    state: 'online',
    lastChanged: firebase.database.ServerValue.TIMESTAMP
  }

  const isOfflineForFirestore = {
    state: 'offline',
    lastChanged: firebase.firestore.FieldValue.serverTimestamp()
  }
  const isOnlineForFirestore = {
    state: 'online',
    lastChanged: firebase.firestore.FieldValue.serverTimestamp()
  }

  const rtdbRef = rtdb.ref(`/status/${user.uid}`)
  const userDoc = db.doc(`/users/${user.uid}`)
  rtdb.ref('.info/connected').on('value', async (snapshot) => {
    if(snapshot.val() === false) {
      userDoc.update({
        status: isOfflineForFirestore
      })
      return
    }
    await rtdbRef.onDisconnect().set(isOfflineForRTDB)
    rtdbRef.set(isOnlineForRTDB);
    userDoc.update({
      status: isOnlineForFirestore
    })
  })
}

export { db, firebase }