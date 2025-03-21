// tests/registerNode.js - Node.js compatible version for testing
// This is a testing-friendly version of Sprint1/SignUpPage/Register.js

// Use global mock functions instead of requiring Firebase
// These will be defined by Jest in the test environment
const initializeApp = global.initializeApp || function() { return {}; };
const getDatabase = global.getDatabase || function() { return {}; };
const ref = global.ref || function() { return {}; };
const set = global.set || function() { return Promise.resolve(); };
const getAuth = global.getAuth || function() { return {}; };
const createUserWithEmailAndPassword = global.createUserWithEmailAndPassword || 
    function() { return Promise.resolve({user: {uid: 'mock-uid'}}); };
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
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !email || !password) {
        document.getElementById("message").innerText = "❌ Please fill in all required fields!";
        return;
    }

    try {
        // Hash the password before storing in Firebase Auth
        const hashedPwd = await hashPassword(password);
        
        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("✅ User registered successfully!：", user);

        // Write data in Firebase Database
        await set(ref(db, "users/" + user.uid), {
            username: username,
            email: email,
            uid: user.uid
        });
        
        console.log("✅ Data written successfully!");
        document.getElementById("message").innerText = "✅ Registration successful!";

        // Clear form fields
        document.getElementById("username").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
    } catch (error) {
        console.error("❌ Registration failed：", error.message);
        document.getElementById("message").innerText = "❌ Registration failed：" + error.message;
    }
};

// For testing exports
if (typeof module !== 'undefined') {
    module.exports = { handleRegister };
}

// If in browser, add event listener
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById("registerForm");
        if (form) {
            form.addEventListener("submit", handleRegister);
        }
    });
}
