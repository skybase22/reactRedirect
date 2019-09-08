import firebase from 'firebase/app'
import 'firebase/database'

var config = {
    apiKey: "AIzaSyDS3UaX3BHpuR9nkgGPEXNwsRz4ZajS6c0",
    authDomain: "psupktmaterial.firebaseapp.com",
    databaseURL: "https://psupktmaterial.firebaseio.com",
    projectId: "psupktmaterial",
    storageBucket: "",
    messagingSenderId: "673539716089",
    appId: "1:673539716089:web:67e7cce961c3cab2"
}

firebase.initializeApp(config);

const database = firebase.database();

export { firebase, database as default}