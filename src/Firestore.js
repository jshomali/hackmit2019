import firebase from 'firebase';

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

export const provider = new firebase.auth.FacebookAuthProvider();
export const auth = firebase.auth();
export default firebase;
