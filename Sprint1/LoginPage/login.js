// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { comparePassword } from './hashUtils.js'; // Import the password comparison function

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

// Event listener for login form submission
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get user info
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        document.getElementById("message").innerText = "❌ Please fill in all required fields!";
        return;
    }

    try {
        // Sign in with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("✅ User logged in successfully!：", user);

        // Fetch the user's hashed password from the Realtime Database
        const userRef = ref(db, "users/" + user.uid);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            const hashedPassword = userData.hashedPassword;

            // Compare the entered password with the hashed password
            const isMatch = await comparePassword(password, hashedPassword);

            if (isMatch) {
                console.log("✅ Passwords match! User authenticated.");
                document.getElementById("message").innerText = "✅ Login successful!";
                // Redirect to the dashboard or another page
                window.location.href = "/dashboard.html";
            } else {
                console.log("❌ Passwords do not match! Authentication failed.");
                document.getElementById("message").innerText = "❌ Invalid email or password.";
            }
        } else {
            console.log("❌ User data not found.");
            document.getElementById("message").innerText = "❌ User data not found.";
        }
    } catch (error) {
        console.error("❌ Login failed：", error.message);
        document.getElementById("message").innerText = "❌ Login failed：" + error.message;
    }
});
