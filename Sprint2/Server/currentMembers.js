import { getDatabase, ref, get, set, onValue, off } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

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
const auth = getAuth(app);

// Get the current user's role
async function getCurrentUserRole(serverId, userId) {
  if (!serverId || !userId) return "member";
  
  try {
    const memberRef = ref(db, `servers/${serverId}/members/${userId}`);
    const snapshot = await get(memberRef);
    
    if (!snapshot.exists()) return "member";
    
    // Handle both string username and object with role
    const memberData = snapshot.val();
    if (typeof memberData === "object" && memberData.role) {
      return memberData.role;
    }
    
    // If it's just a username string or no role specified
    return userId === serverId.createdBy ? "owner" : "member";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "member";
  }
}

// Check if the user can perform an action based on their role
function canPerformAction(userRole, requiredRole) {
  const roleHierarchy = { owner: 3, admin: 2, member: 1 };
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

// Update UI based on user's role
async function updateUIForRole(serverId, userId) {
  const userRole = await getCurrentUserRole(serverId, userId);
  const settingsButton = document.getElementById("settingsButton");
  const settingsDropdown = document.getElementById("settingsDropdown");
  const deleteServerBtn = document.getElementById("deleteServer");
  const promoteBtn = document.getElementById("promoteToAdmin");
  const demoteBtn = document.getElementById("demoteToMember");
  
  // Show/hide settings button based on role
  if (settingsButton) {
    settingsButton.style.display = canPerformAction(userRole, "member") ? "block" : "none";
  }
  
  // Show/hide specific actions based on role
  if (deleteServerBtn) deleteServerBtn.style.display = canPerformAction(userRole, "owner") ? "block" : "none";
  if (promoteBtn) promoteBtn.style.display = canPerformAction(userRole, "owner") ? "block" : "none";
  if (demoteBtn) demoteBtn.style.display = canPerformAction(userRole, "owner") ? "block" : "none";
}

// Create and display a member modal
function createMemberModal() {
  // Check if modal already exists
  let memberModal = document.getElementById("memberModal");
  if (memberModal) {
    return memberModal;
  }
  
  // Create modal elements
  memberModal = document.createElement("div");
  memberModal.id = "memberModal";
  memberModal.className = "popUp";
  
  const modalContent = document.createElement("div");
  modalContent.className = "popUp-content";
  modalContent.style.width = "400px";
  
  const closeButton = document.createElement("span");
  closeButton.className = "close-button";
  closeButton.innerHTML = "&times;";
  closeButton.onclick = () => memberModal.style.display = "none";
  
  const title = document.createElement("h2");
  title.textContent = "Server Members";
  
  const membersList = document.createElement("div");
  membersList.id = "membersListContainer";
  membersList.style.maxHeight = "300px";
  membersList.style.overflowY = "auto";
  membersList.style.margin = "15px 0";
  membersList.style.textAlign = "left";
  
  modalContent.appendChild(closeButton);
  modalContent.appendChild(title);
  modalContent.appendChild(membersList);
  memberModal.appendChild(modalContent);
  document.body.appendChild(memberModal);
  
  return memberModal;
}

// Display members with action buttons
async function displayMembers(serverId) {
  if (!serverId) {
    alert("❌ No server selected.");
    return;
  }
  
  try {
    const currentUserRole = await getCurrentUserRole(serverId, auth.currentUser.uid);
    const membersRef = ref(db, `servers/${serverId}/members`);
    const snapshot = await get(membersRef);
    
    // Create and show modal
    const memberModal = createMemberModal();
    const membersListContainer = document.getElementById("membersListContainer");
    membersListContainer.innerHTML = "";
    
    if (snapshot.exists()) {
      snapshot.forEach((memberSnap) => {
        const memberId = memberSnap.key;
        const memberData = memberSnap.val();
        
        // Handle both formats (string username or object with role)
        let username = memberData;
        let role = "member";
        
        if (typeof memberData === "object") {
          username = memberData.username || "Unknown";
          role = memberData.role || "member";
        }
        
        // Create member container
        const memberDiv = document.createElement("div");
        memberDiv.className = "member-item";
        memberDiv.style.padding = "10px";
        memberDiv.style.marginBottom = "10px";
        memberDiv.style.backgroundColor = "#f1f1f1";
        memberDiv.style.borderRadius = "5px";
        memberDiv.style.display = "flex";
        memberDiv.style.justifyContent = "space-between";
        memberDiv.style.alignItems = "center";
        
        // Member info
        const memberInfo = document.createElement("div");
        memberInfo.innerHTML = `
          <strong>${username}</strong>
          <span style="margin-left: 10px; padding: 2px 6px; background: ${
            role === "owner" ? "#ff9800" : 
            role === "admin" ? "#4CAF50" : "#2196F3"
          }; color: white; border-radius: 3px; font-size: 12px;">
            ${role}
          </span>
        `;
        
        // Action buttons container
        const actionButtons = document.createElement("div");
        actionButtons.style.display = "flex";
        actionButtons.style.gap = "5px";
        
        // Only show promote/demote buttons if current user is owner
        if (canPerformAction(currentUserRole, "owner") && memberId !== auth.currentUser.uid) {
          // Promote button - only show for members
          if (role === "member") {
            const promoteBtn = document.createElement("button");
            promoteBtn.textContent = "Promote";
            promoteBtn.className = "action-button promote";
            promoteBtn.style.backgroundColor = "#4CAF50";
            promoteBtn.style.color = "white";
            promoteBtn.style.border = "none";
            promoteBtn.style.padding = "5px 10px";
            promoteBtn.style.borderRadius = "3px";
            promoteBtn.style.cursor = "pointer";
            
            promoteBtn.onclick = async () => {
              await set(ref(db, `servers/${serverId}/members/${memberId}`), {
                username: username,
                role: "admin"
              });
}

// Initialize event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Override the viewMembers button click event
  const viewMembersBtn = document.getElementById("viewMembers");
  if (viewMembersBtn) {
    viewMembersBtn.addEventListener("click", () => {
      // Get selectedServer from window
      const selectedServer = window.selectedServer;
      
      if (selectedServer) {
        displayMembers(selectedServer.id);
      } else {
        alert("❌ Please select a server first.");
      }
    });
  }
  
  // Add listeners for promote/demote buttons in settings dropdown
  const promoteToAdminBtn = document.getElementById("promoteToAdmin");
  if (promoteToAdminBtn) {
    promoteToAdminBtn.addEventListener("click", async () => {
      const selectedServer = window.selectedServer;
      if (!selectedServer) {
        alert("❌ Please select a server first.");
        return;
      }
      
      // Check if current user is owner
      const userRole = await getCurrentUserRole(selectedServer.id, auth.currentUser.uid);
      if (userRole !== "owner") {
        alert("❌ Only the owner can promote members to admin.");
        return;
      }
      
      displayMembers(selectedServer.id);
    });
  }
  
  const demoteToMemberBtn = document.getElementById("demoteToMember");
  if (demoteToMemberBtn) {
    demoteToMemberBtn.addEventListener("click", async () => {
      const selectedServer = window.selectedServer;
      if (!selectedServer) {
        alert("❌ Please select a server first.");
        return;
      }
      
      // Check if current user is owner
      const userRole = await getCurrentUserRole(selectedServer.id, auth.currentUser.uid);
      if (userRole !== "owner") {
        alert("❌ Only the owner can demote admins to members.");
        return;
      }
      
      displayMembers(selectedServer.id);
    });
  }
  
  // Override add member functionality to use proper member structure
  const confirmAddMemberBtn = document.getElementById("confirmAddMember");
  if (confirmAddMemberBtn) {
    confirmAddMemberBtn.addEventListener("click", async () => {
      const username = document.getElementById("memberUsernameInput").value.trim();
      const selectedServer = window.selectedServer;
      
      if (!username) {
        alert("Please enter a username.");
        return;
      }
      
      if (!selectedServer) {
        alert("❌ No server selected.");
        return;
      }
      
      try {
        const usersSnapshot = await get(ref(db, "users"));
        let userFound = false;
        
        usersSnapshot.forEach((userSnap) => {
          const user = userSnap.val();
          if (user.username === username) {
            userFound = true;
            // Set proper member structure with role
            set(ref(db, `servers/${selectedServer.id}/members/${userSnap.key}`), {
              username: username,
              role: "member"
            });
          }
        });
        
        if (userFound) {
          alert(`✅ ${username} was added to ${selectedServer.name} successfully!`);
          document.getElementById("addMemberPopUp").style.display = "none";
          document.getElementById("memberUsernameInput").value = "";
        } else {
          alert("❌ User not found.");
        }
      } catch (error) {
        console.error("❌ Error adding member:", error);
        alert("Failed to add member.");
      }
    });
  }
});

// Make functions available in the global scope
function exportFunctions() {
    console.log("Exporting member management functions to window object...");
    window.getCurrentUserRole = getCurrentUserRole;
    window.canPerformAction = canPerformAction;
    window.updateUIForRole = updateUIForRole;
    window.setupMessageListeners = setupMessageListeners;
    window.displayMembers = displayMembers;
    console.log("Member functions exported successfully");
}

// Export functions right away and also when the document is loaded
exportFunctions();
window.addEventListener('DOMContentLoaded', exportFunctions);
window.addEventListener('load', exportFunctions);
              memberModal.style.display = "none";
              alert(`✅ ${username} has been promoted to admin!`);
              displayMembers(serverId); // Refresh the member list
            };
            
            actionButtons.appendChild(promoteBtn);
          }
          
          // Demote button - only show for admins
          if (role === "admin") {
            const demoteBtn = document.createElement("button");
            demoteBtn.textContent = "Demote";
            demoteBtn.className = "action-button demote";
            demoteBtn.style.backgroundColor = "#f44336";
            demoteBtn.style.color = "white";
            demoteBtn.style.border = "none";
            demoteBtn.style.padding = "5px 10px";
            demoteBtn.style.borderRadius = "3px";
            demoteBtn.style.cursor = "pointer";
            
            demoteBtn.onclick = async () => {
              await set(ref(db, `servers/${serverId}/members/${memberId}`), {
                username: username,
                role: "member"
              });
              memberModal.style.display = "none";
              alert(`✅ ${username} has been demoted to member!`);
              displayMembers(serverId); // Refresh the member list
            };
            
            actionButtons.appendChild(demoteBtn);
          }
          
          // Remove button (for both members and admins, but not owners)
          if (role !== "owner") {
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.className = "action-button remove";
            removeBtn.style.backgroundColor = "#9e9e9e";
            removeBtn.style.color = "white";
            removeBtn.style.border = "none";
            removeBtn.style.padding = "5px 10px";
            removeBtn.style.borderRadius = "3px";
            removeBtn.style.cursor = "pointer";
            
            removeBtn.onclick = async () => {
              const confirm = window.confirm(`Are you sure you want to remove ${username} from the server?`);
              if (confirm) {
                await set(ref(db, `servers/${serverId}/members/${memberId}`), null);
                memberModal.style.display = "none";
                alert(`✅ ${username} has been removed from the server!`);
                displayMembers(serverId); // Refresh the member list
              }
            };
            
            actionButtons.appendChild(removeBtn);
          }
        }
        
        memberDiv.appendChild(memberInfo);
        memberDiv.appendChild(actionButtons);
        membersListContainer.appendChild(memberDiv);
      });
    } else {
      membersListContainer.innerHTML = "<p>No members found in this server.</p>";
    }
    
    memberModal.style.display = "flex";
  } catch (error) {
    console.error("❌ Error fetching members:", error);
    alert("Failed to load members.");
  }
}

// Setup real-time listeners for messages
function setupMessageListeners(serverId, channelId) {
  if (!serverId || !channelId) return;
  
  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = "";
  
  // Create reference to messages
  const messagesRef = ref(db, `servers/${serverId}/channels/${channelId}/messages`);
  
  // Remove any existing listeners
  off(messagesRef);
  
  // Listen for all messages with real-time updates
  onValue(messagesRef, (snapshot) => {
    messagesDiv.innerHTML = "";
    
    if (snapshot.exists()) {
      // Convert to array for sorting
      const messagesArray = [];
      snapshot.forEach((childSnapshot) => {
        messagesArray.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      // Sort messages by timestamp
      messagesArray.sort((a, b) => a.timestamp - b.timestamp);
      
      // Display messages
      messagesArray.forEach((message) => {
        const messageElement = document.createElement("div");
        messageElement.className = `message ${message.senderId === auth.currentUser.uid ? 'sent' : 'received'}`;
        messageElement.innerHTML = `
          <div class="message-header">${message.senderName}</div>
          <div class="message-text">${message.text}</div>
          <div class="message-time">${new Date(message.timestamp).toLocaleTimeString()}</div>
        `;
        messagesDiv.appendChild(messageElement);
      });
      
      // Scroll to the bottom
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  });
