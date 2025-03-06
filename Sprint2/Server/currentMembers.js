import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";

// Firebase Config
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

// Get the current user's role
async function getCurrentUserRole(serverId, userId) {
  const roleRef = ref(db, `servers/${serverId}/members/${userId}/role`);
  const snapshot = await get(roleRef);
  return snapshot.exists() ? snapshot.val() : "member"; // Default to member if role is not set
}

// Check if the user can perform an action based on their role
function canPerformAction(userRole, requiredRole) {
  const roleHierarchy = { owner: 3, admin: 2, member: 1 };
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

// View members
const viewMembersBtn = document.getElementById("viewMembers");
viewMembersBtn.addEventListener("click", async () => {
  const selectedChannelId = document.body.dataset.selectedChannel;

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
        const memberData = memberSnap.val();
        membersList += `- ${memberData.username} (${memberData.role})\n`;
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
