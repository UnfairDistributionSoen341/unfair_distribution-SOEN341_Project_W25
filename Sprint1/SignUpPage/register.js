// 1️⃣ import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { hashPassword } from './hashUtils.js'; 

// 2️⃣ Firebase set up
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

// 3️⃣ initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// 4️⃣ event
document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // get users info
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !email || !password) {
        document.getElementById("message").innerText = "❌ Please fill in all required fields!";
        return;
    }

    // 5️⃣ registration data in Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("✅ User registered successfully!：", user);

            // write data in Firebase Database
            return set(ref(db, "users/" + user.uid), {
                username: username,
                email: email,
                uid: user.uid
            });
        })
        .then(() => {
            console.log("✅ Data written successfully!");
            document.getElementById("message").innerText = "✅ Registration successful!";


            document.getElementById("username").value = "";
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
        })
        .catch((error) => {
            console.error("❌ Registration failed：", error.message);
            document.getElementById("message").innerText = "❌ Registration failed：" + error.message;
        });
});
