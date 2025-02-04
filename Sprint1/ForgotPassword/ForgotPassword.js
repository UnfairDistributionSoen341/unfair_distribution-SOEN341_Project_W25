// forgotPassword.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { hashPassword } from './hashUtils.js'; // Import the hashing function

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

// Event listener for forgot password form submission
document.getElementById("forgotPasswordForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get user info
    const email = document.getElementById("email").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();

    if (!email || !newPassword) {
        document.getElementById("message").innerText = "❌ Please fill in all required fields!";
        return;
    }

    try {
        // Send a password reset email (optional, for Firebase Authentication)
        await sendPasswordResetEmail(auth, email);
        console.log("✅ Password reset email sent!");

        // Fetch the user's UID from the Realtime Database
        const usersRef = ref(db, "users");
        const snapshot = await get(usersRef);
        let userUid = null;

        if (snapshot.exists()) {
            const users = snapshot.val();
            for (const uid in users) {
                if (users[uid].email === email) {
                    userUid = uid;
                    break;
                }
            }
        }

        if (!userUid) {
            throw new Error("User not found.");
        }

        // Hash the new password
        const hashedPassword = await hashPassword(newPassword);

        // Update the user's hashed password in the Realtime Database
        await set(ref(db, "users/" + userUid + "/hashedPassword"), hashedPassword);
        console.log("✅ Password updated successfully!");

        document.getElementById("message").innerText = "✅ Password updated successfully!";
    } catch (error) {
        console.error("❌ Password reset failed：", error.message);
        document.getElementById("message").innerText = "❌ Password reset failed：" + error.message;
    }
});
