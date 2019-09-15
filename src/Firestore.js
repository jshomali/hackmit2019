import firebase from 'firebase';
import "firebase/auth";
import "firebase/firestore";
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCM_156Zw8-g6H_u35HxmDjSvx010iF4pA",
    authDomain: "halogen-eon-252916.firebaseapp.com",
    databaseURL: "https://halogen-eon-252916.firebaseio.com",
    projectId: "halogen-eon-252916",
    storageBucket: "halogen-eon-252916.appspot.com",
    messagingSenderId: "436327864175",
    appId: "1:436327864175:web:2ad72f55d10616f7957a9a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const ref = firebase.database().ref()
export const auth = firebase.auth
export const provider = new firebase.auth.FacebookAuthProvider()
export default firebase;
