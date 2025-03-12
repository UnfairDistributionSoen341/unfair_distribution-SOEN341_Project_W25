
+10
-3
Original file line number	Original file line	Diff line number	Diff line change
@@ -1,29 +1,36 @@
// tests/registerNode.js - Node.js compatible version for testing
// This is a testing-friendly version of Sprint1/SignUpPage/Register.js
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { hashPassword } = require('./hashUtilsNode');

// Firebase set up
const firebaseConfig = {
    apiKey: "AIzaSyDFhghmxUfCJbnnOFsleHoatF7D-ubnLpU",
    authDomain: "project-8042491080443698183.firebaseapp.com",
    databaseURL: "https://project-8042491080443698183-default-rtdb.firebaseio.com",
    projectId: "project-8042491080443698183",
    storageBucket: "project-8042491080443698183.firebasestorage.app",
    messagingSenderId: "583304911847",
    appId: "1:583304911847:web:8dfe3e5c016062dd457b42",
    measurementId: "G-KQMXKEVNQ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Registration handler
const handleRegister = async (event) => {
    event.preventDefault();

    // Get users info
