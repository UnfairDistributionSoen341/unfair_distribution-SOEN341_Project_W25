import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";

// Firebase Config (reuse the same config)
const firebaseConfig = {
  apiKey: "AIzaSyDFhghmxUfCJbnnOFsleHoatF7D-ubnLpU",
  authDomain: "project-8042491080443698183.firebaseapp.com",
  databaseURL: "https://project-8042491080443698183-default-rtdb.firebaseio.com",
  projectId: "project-8042491080443698183",
  storageBucket: "project-8042491080443698183.appspot.com",
  messagingSenderId: "583304911847",
  appId: "1:583304911847:web:8dfe3e5c016062dd457b42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

viewMembersBtn.addEventListener("click", async () => {
    const selectedChannelId = document.body.dataset.selectedChannel; // ✅ Get it from the body
  
    if (!selectedChannelId) {
      alert("❌ No channel selected.");
      return;
    }
  
    try {
      const membersRef = ref(db, `channels/${selectedChannelId}/members`);
      const snapshot = await get(membersRef);
  
      if (snapshot.exists()) {
        let membersList = "👥 Members:\n";
        snapshot.forEach((memberSnap) => {
          membersList += `- ${memberSnap.val()}\n`;
        });
        alert(membersList);
      } else {
        alert("❌ No members found in this channel.");
      }
    } catch (error) {
      console.error("❌ Error fetching members:", error);
      alert("Failed to load members.");
    }
  });

// Show members on clicking "View Members"
const viewMembersBtn = document.getElementById("viewMembers");

viewMembersBtn.addEventListener("click", async () => {
  if (!selectedChannelId) {
    alert("❌ No channel selected.");
    return;
  }

  try {
    const membersRef = ref(db, `channels/${selectedChannelId}/members`);
    const snapshot = await get(membersRef);

    if (snapshot.exists()) {
      let membersList = "👥 Members:\n";
      snapshot.forEach((memberSnap) => {
        membersList += `- ${memberSnap.val()}\n`;
      });
      alert(membersList);
    } else {
      alert("❌ No members found in this channel.");
    }
  } catch (error) {
    console.error("❌ Error fetching members:", error);
    alert("Failed to load members.");
  }
});