import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";

// our Firebase settings
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

//initialization
const app = initializeApp(firebaseConfig);

console.log("🔥 Firebase initialize succeed！");

const db = getDatabase();
set(ref(db, "users/user1"), {
    username: "hy131",
    email: "hy131@example.com"
}).then(() => {
    console.log("✅ set data succeed！");
}).catch((error) => {
    console.error("❌ set data failed", error);
});

get(child(ref(db), "users/user1")).then((snapshot) => {
    if (snapshot.exists()) {
        console.log("users data：", snapshot.val());
    } else {
        console.log("❌ cannot find users data");
    }
}).catch((error) => {
    console.error("❌ reading data failed：", error);
});