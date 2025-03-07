import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Get database and auth instances
const db = getDatabase();
const auth = getAuth();

// Get the current user's role - this is used by server_interface.html
async function getCurrentUserRole(serverId, userId) {
  if (!serverId || !userId) return "member";
  
  try {
    // First check if user is the creator (owner)
    const serverRef = ref(db, `servers/${serverId}`);
    const serverSnapshot = await get(serverRef);
    
    if (serverSnapshot.exists() && serverSnapshot.val().createdBy === userId) {
      return "owner";
    }
    
    // Then check if they have a role in members
    const memberRef = ref(db, `servers/${serverId}/members/${userId}`);
    const snapshot = await get(memberRef);
    
    if (!snapshot.exists()) return "member";
    
    // Handle both string username and object with role
    const memberData = snapshot.val();
    if (typeof memberData === "object" && memberData.role) {
      return memberData.role;
    }
    
    return "member";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "member";
  }
}

// Create and display members modal
function displayMembers(serverId) {
  if (!serverId) {
    alert("❌ Please select a server first.");
    return;
  }
  
  // Create modal if it doesn't exist
  let memberModal = document.getElementById("memberModal");
  if (!memberModal) {
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
    
    modalContent.appendChild(closeButton);
    modalContent.appendChild(title);
    modalContent.appendChild(membersList);
    memberModal.appendChild(modalContent);
    document.body.appendChild(memberModal);
  }
  
  // Populate the modal with members
  populateMembers(serverId);
  
  // Show the modal
  memberModal.style.display = "flex";
}

// Populate members in the modal
async function populateMembers(serverId) {
  const membersListContainer = document.getElementById("membersListContainer");
  membersListContainer.innerHTML = "<p>Loading members...</p>";
  
  try {
    // Get current user's role
    const currentUserRole = await getCurrentUserRole(serverId, auth.currentUser.uid);
    
    // Get server members
    const membersRef = ref(db, `servers/${serverId}/members`);
    const snapshot = await get(membersRef);
    
    if (!snapshot.exists()) {
      membersListContainer.innerHTML = "<p>No members found.</p>";
      return;
    }
    
    membersListContainer.innerHTML = "";
    
    // Add each member
    snapshot.forEach((memberSnap) => {
      const memberId = memberSnap.key;
      const memberData = memberSnap.val();
      
      // Handle both formats
      let username, role;
      if (typeof memberData === 'string') {
        username = memberData;
        role = "member";
      } else {
        username = memberData.username || "Unknown";
        role = memberData.role || "member";
      }
      
      // Check if owner
      if (memberId === auth.currentUser.uid && currentUserRole === "owner") {
        role = "owner";
      }
      
      // Create member div
      const memberDiv = document.createElement("div");
      memberDiv.className = "member-item";
      memberDiv.style.padding = "10px";
      memberDiv.style.margin = "5px 0";
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
      
      // Action buttons
      const actionButtons = document.createElement("div");
      actionButtons.style.display = "flex";
      actionButtons.style.gap = "5px";
      
      // Only show actions for other members
      if (memberId !== auth.currentUser.uid) {
        
        // Promote button (for members if current user is owner)
        if (role === "member" && currentUserRole === "owner") {
          const promoteBtn = document.createElement("button");
          promoteBtn.textContent = "Promote";
          promoteBtn.style.backgroundColor = "#4CAF50";
          promoteBtn.style.color = "white";
          promoteBtn.style.border = "none";
          promoteBtn.style.padding = "5px 10px";
          promoteBtn.style.borderRadius = "3px";
          promoteBtn.style.cursor = "pointer";
          
          promoteBtn.onclick = async () => {
            try {
              await set(ref(db, `servers/${serverId}/members/${memberId}`), {
                username: username,
                role: "admin"
              });
              
              alert(`✅ ${username} has been promoted to admin!`);
              populateMembers(serverId); // Refresh
            } catch (error) {
              console.error("Error promoting member:", error);
              alert("❌ Failed to promote member.");
            }
          };
          
          actionButtons.appendChild(promoteBtn);
        }
        
        // Demote button (for admins if current user is owner)
        if (role === "admin" && currentUserRole === "owner") {
          const demoteBtn = document.createElement("button");
          demoteBtn.textContent = "Demote";
          demoteBtn.style.backgroundColor = "#f44336";
          demoteBtn.style.color = "white";
          demoteBtn.style.border = "none";
          demoteBtn.style.padding = "5px 10px";
          demoteBtn.style.borderRadius = "3px";
          demoteBtn.style.cursor = "pointer";
          
          demoteBtn.onclick = async () => {
            try {
              await set(ref(db, `servers/${serverId}/members/${memberId}`), {
                username: username,
                role: "member"
              });
              
              alert(`✅ ${username} has been demoted to member!`);
              populateMembers(serverId); // Refresh
            } catch (error) {
              console.error("Error demoting member:", error);
              alert("❌ Failed to demote member.");
            }
          };
          
          actionButtons.appendChild(demoteBtn);
        }
        
        // Remove button (if not owner and current user is admin/owner)
        if (role !== "owner" && (currentUserRole === "admin" || currentUserRole === "owner")) {
          const removeBtn = document.createElement("button");
          removeBtn.textContent = "Remove";
          removeBtn.style.backgroundColor = "#9e9e9e";
          removeBtn.style.color = "white";
          removeBtn.style.border = "none";
          removeBtn.style.padding = "5px 10px";
          removeBtn.style.borderRadius = "3px";
          removeBtn.style.cursor = "pointer";
          
          removeBtn.onclick = async () => {
            if (confirm(`Are you sure you want to remove ${username} from the server?`)) {
              try {
                await set(ref(db, `servers/${serverId}/members/${memberId}`), null);
                
                alert(`✅ ${username} has been removed from the server!`);
                populateMembers(serverId); // Refresh
              } catch (error) {
                console.error("Error removing member:", error);
                alert("❌ Failed to remove member.");
              }
            }
          };
          
          actionButtons.appendChild(removeBtn);
        }
      }
      
      memberDiv.appendChild(memberInfo);
      memberDiv.appendChild(actionButtons);
      membersListContainer.appendChild(memberDiv);
    });
    
  } catch (error) {
    console.error("Error displaying members:", error);
    membersListContainer.innerHTML = "<p>Error loading members.</p>";
  }
}

// Add event listeners to dropdown buttons
function setupMemberButtons() {
  // View Members
  const viewMembersBtn = document.getElementById("viewMembers");
  if (viewMembersBtn) {
    viewMembersBtn.onclick = () => {
      console.log("View members clicked");
      const selectedServer = window.selectedServer;
      if (!selectedServer) {
        alert("❌ Please select a server first.");
        return;
      }
      displayMembers(selectedServer.id);
    };
  }
  
  // Promote to Admin
  const promoteBtn = document.getElementById("promoteToAdmin");
  if (promoteBtn) {
    promoteBtn.onclick = async () => {
      console.log("Promote to admin clicked");
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
    };
  }
  
  // Demote to Member
  const demoteBtn = document.getElementById("demoteToMember");
  if (demoteBtn) {
    demoteBtn.onclick = async () => {
      console.log("Demote to member clicked");
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
    };
  }
  
  // Remove Member
  const removeBtn = document.getElementById("removeMember");
  if (removeBtn) {
    removeBtn.onclick = async () => {
      console.log("Remove member clicked");
      const selectedServer = window.selectedServer;
      if (!selectedServer) {
        alert("❌ Please select a server first.");
        return;
      }
      
      // Check if current user is admin or owner
      const userRole = await getCurrentUserRole(selectedServer.id, auth.currentUser.uid);
      if (userRole !== "admin" && userRole !== "owner") {
        alert("❌ Only admins and owners can remove members.");
        return;
      }
      
      displayMembers(selectedServer.id);
    };
  }
}

// Initialize everything
function initMemberFunctions() {
  console.log("Initializing member management functions");
  
  // Assign functions to window object
  window.getCurrentUserRole = getCurrentUserRole;
  window.displayMembers = displayMembers;
  
  // Setup buttons
  setupMemberButtons();
  
  console.log("Member management functions initialized");
}

// Run initialization when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing member management");
  
  // Set a slight delay to ensure all elements are loaded
  setTimeout(() => {
    initMemberFunctions();
  }, 500);
});

// Also export immediately to ensure availability
window.getCurrentUserRole = getCurrentUserRole;
window.displayMembers = displayMembers;

// Run init again when window is fully loaded
window.addEventListener('load', () => {
  console.log("Window loaded, initializing member management again");
  initMemberFunctions();
});

// Run init now in case DOM is already loaded
initMemberFunctions();
