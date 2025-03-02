import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDFhghmxUfCJbnnOFsleHoatF7D-ubnLpU",
  authDomain: "project-8042491080443698183.firebaseapp.com",
  databaseURL: "https://project-8042491080443698183-default-rtdb.firebaseio.com",
  projectId: "project-8042491080443698183",
  storageBucket: "project-8042491080443698183.appspot.com",
  messagingSenderId: "583304911847",
  appId: "1:583304911847:web:8dfe3e5c016062dd457b42"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ User is logged in:", user.email);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const addMemberBtn = document.getElementById("addMember");
  const modal = document.getElementById("addMemberPopUp");
  const closeModalBtn = document.getElementById("closeAddMemberPopUp");
  const confirmAddBtn = document.getElementById("confirmAddMember");

  addMemberBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  confirmAddBtn.addEventListener("click", async () => {
    const username = document.getElementById("memberUsernameInput").value.trim();
    if (!username) {
      alert("Please enter a username.");
      return;
    }

    const selectedChannelId = window.selectedChannelId;
    if (!selectedChannelId) {
      alert("No channel selected.");
      return;
    }

    try {
      const usersSnapshot = await get(ref(db, "users"));
      let userFound = false;

      usersSnapshot.forEach((userSnap) => {
        const user = userSnap.val();
        if (user.username === username) {
          userFound = true;
          set(ref(db, `channels/${selectedChannelId}/members/${userSnap.key}`), username);
        }
      });

      if (userFound) {
        alert(`✅ ${username} was added successfully!`);
        modal.style.display = "none";
      } else {
        alert("❌ User not found.");
      }
    } catch (error) {
      console.error("❌ Error adding member:", error);
      alert("Failed to add member.");
    }
  });
});