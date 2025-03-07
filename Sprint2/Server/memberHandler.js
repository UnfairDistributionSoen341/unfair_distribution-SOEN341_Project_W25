import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Get database and auth instances
const db = getDatabase();
const auth = getAuth();

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

// Create and display member management modal
async function showMemberManagementModal(serverId) {
  if (!serverId) {
    alert("❌ Please select a server first.");
    return;
  }
  
  try {
    // Get current user role (to check permissions)
    const currentUserId = auth.currentUser.uid;
    const serverRef = ref(db, `servers/${serverId}`);
    const serverSnapshot = await get(serverRef);
    const server = serverSnapshot.val();
    const isOwner = server.createdBy === currentUserId;
    
    // Get members
    const membersRef = ref(db, `servers/${serverId}/members`);
    const membersSnapshot = await get(membersRef);
    
    if (!membersSnapshot.exists()) {
      alert("❌ No members found in this server.");
      return;
    }
    
    // Create modal
    const modal = document.createElement("div");
    modal.className = "popUp";
    modal.id = "memberManagementModal";
    modal.style.display = "flex";
    
    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.className = "popUp-content";
    modalContent.style.width = "400px";
    modalContent.style.maxHeight = "80vh";
    modalContent.style.overflowY = "auto";
    
    // Add close button
    const closeButton = document.createElement("span");
    closeButton.className = "close-button";
    closeButton.innerHTML = "&times;";
    closeButton.onclick = () => document.body.removeChild(modal);
    
    // Add title
    const title = document.createElement("h2");
    title.textContent = "Manage Server Members";
    title.style.marginBottom = "20px";
    
    // Add members list
    const membersList = document.createElement("div");
    membersList.style.textAlign = "left";
    
    // Populate members list
    membersSnapshot.forEach((memberSnap) => {
      const memberId = memberSnap.key;
      const memberData = memberSnap.val();
      
      // Extract username and role
      let username = memberData;
      let role = "member";
      
      if (typeof memberData === "object") {
        username = memberData.username || "Unknown";
        role = memberData.role || "member";
      }
      
      // For owner role, check if this member is the creator
      if (memberId === server.createdBy) {
        role = "owner";
      }
      
      // Create member item
      const memberItem = document.createElement("div");
      memberItem.style.padding = "10px";
      memberItem.style.margin = "10px 0";
      memberItem.style.backgroundColor = "#f1f1f1";
      memberItem.style.borderRadius = "5px";
      memberItem.style.display = "flex";
      memberItem.style.justifyContent = "space-between";
      memberItem.style.alignItems = "center";
      
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
      
      // Only show actions if current user is owner and not acting on themselves
      if (isOwner && memberId !== currentUserId) {
        // Promote button (for members)
        if (role === "member") {
          const promoteBtn = document.createElement("button");
          promoteBtn.textContent = "Promote";
          promoteBtn.style.backgroundColor = "#4CAF50";
          promoteBtn.style.color = "white";
          promoteBtn.style.border = "none";
          promoteBtn.style.padding = "5px 10px";
          promoteBtn.style.borderRadius = "3px";
          promoteBtn.style.cursor = "pointer";
          promoteBtn.style.fontSize = "12px";
          
          promoteBtn.onclick = async () => {
            // Store both username and role
            await set(ref(db, `servers/${serverId}/members/${memberId}`), {
              username: username,
              role: "admin"
            });
            
            alert(`✅ ${username} has been promoted to admin!`);
            document.body.removeChild(modal);
            showMemberManagementModal(serverId); // Refresh with updated roles
          };
          
          actionButtons.appendChild(promoteBtn);
        }
        
        // Demote button (for admins)
        if (role === "admin") {
          const demoteBtn = document.createElement("button");
          demoteBtn.textContent = "Demote";
          demoteBtn.style.backgroundColor = "#f44336";
          demoteBtn.style.color = "white";
          demoteBtn.style.border = "none";
          demoteBtn.style.padding = "5px 10px";
          demoteBtn.style.borderRadius = "3px";
          demoteBtn.style.cursor = "pointer";
          demoteBtn.style.fontSize = "12px";
          
          demoteBtn.onclick = async () => {
            // Store both username and role
            await set(ref(db, `servers/${serverId}/members/${memberId}`), {
              username: username,
              role: "member"
            });
            
            alert(`✅ ${username} has been demoted to member!`);
            document.body.removeChild(modal);
            showMemberManagementModal(serverId); // Refresh with updated roles
          };
          
          actionButtons.appendChild(demoteBtn);
        }
        
        // Remove button (for all except owner)
        if (role !== "owner") {
          const removeBtn = document.createElement("button");
          removeBtn.textContent = "Remove";
          removeBtn.style.backgroundColor = "#9e9e9e";
          removeBtn.style.color = "white";
          removeBtn.style.border = "none";
          removeBtn.style.padding = "5px 10px";
          removeBtn.style.borderRadius = "3px";
          removeBtn.style.cursor = "pointer";
          removeBtn.style.fontSize = "12px";
          
          removeBtn.onclick = async () => {
            if (confirm(`Are you sure you want to remove ${username} from the server?`)) {
              await set(ref(db, `servers/${serverId}/members/${memberId}`), null);
              alert(`✅ ${username} has been removed from the server!`);
              document.body.removeChild(modal);
              showMemberManagementModal(serverId); // Refresh with updated members
            }
          };
          
          actionButtons.appendChild(removeBtn);
        }
      }
      
      memberItem.appendChild(memberInfo);
      memberItem.appendChild(actionButtons);
      membersList.appendChild(memberItem);
    });
    
    // Assemble modal
    modalContent.appendChild(closeButton);
    modalContent.appendChild(title);
    modalContent.appendChild(membersList);
    modal.appendChild(modalContent);
    
    // Add to page
    document.body.appendChild(modal);
    
  } catch (error) {
    console.error("Error showing member management:", error);
    alert("❌ Failed to load member management. See console for details.");
  }
}

// Add role management buttons to the settings dropdown
function addRoleManagementButtons() {
  const settingsDropdown = document.getElementById("settingsDropdown");
  if (!settingsDropdown) return;
  
  // Check if buttons already exist
  if (document.getElementById("promoteToAdmin")) return;
  
  // Add promote/demote buttons
  const promoteBtn = document.createElement("button");
  promoteBtn.id = "promoteToAdmin";
  promoteBtn.innerHTML = "⭐ Promote to Admin";
  promoteBtn.style.backgroundColor = "#4CAF50";
  promoteBtn.style.color = "white";
  
  const demoteBtn = document.createElement("button");
  demoteBtn.id = "demoteToMember";
  demoteBtn.innerHTML = "⬇ Demote to Member";
  demoteBtn.style.backgroundColor = "#f44336";
  demoteBtn.style.color = "white";
  
  const deleteServerBtn = document.createElement("button");
  deleteServerBtn.id = "deleteServer";
  deleteServerBtn.innerHTML = "❌ Delete Server";
  deleteServerBtn.style.backgroundColor = "#ff0000";
  deleteServerBtn.style.color = "white";
  
  // Add buttons to dropdown
  settingsDropdown.appendChild(promoteBtn);
  settingsDropdown.appendChild(demoteBtn);
  settingsDropdown.appendChild(deleteServerBtn);
  
  // Setup event listeners for buttons
  promoteBtn.onclick = async () => {
    await set(ref(db, `servers/${serverId}/members/${memberId}`), {
        username: username,
        role: "admin"
    });
    alert(`✅ ${username} has been promoted to admin!`);
    document.body.removeChild(modal);
    showMemberManagementModal(serverId); // Refresh the modal to show updated roles
};
  
demoteBtn.onclick = async () => {
    await set(ref(db, `servers/${serverId}/members/${memberId}`), {
        username: username,
        role: "member"
    });
    alert(`✅ ${username} has been demoted to member!`);
    document.body.removeChild(modal);
    showMemberManagementModal(serverId); // Refresh the modal to show updated roles
};
  
  deleteServerBtn.addEventListener("click", async () => {
    const selectedServer = window.selectedServer || selectedServer;
    if (!selectedServer) {
      alert("❌ Please select a server first.");
      return;
    }
    
    // Check if user is owner
    const currentUserId = auth.currentUser.uid;
    const serverRef = ref(db, `servers/${selectedServer.id}`);
    const serverSnapshot = await get(serverRef);
    const server = serverSnapshot.val();
    
    if (server.createdBy !== currentUserId) {
      alert("❌ Only the server owner can delete the server.");
      return;
    }
    
    if (confirm(`Are you sure you want to delete the server "${selectedServer.name}"? This action cannot be undone.`)) {
      await set(serverRef, null);
      alert(`✅ Server "${selectedServer.name}" has been deleted.`);
      window.location.reload(); // Reload to show updated server list
    }
  });
}

// Override the viewMembers button to use the new modal
function overrideViewMembersButton() {
  const viewMembersBtn = document.getElementById("viewMembers");
  if (!viewMembersBtn) return;
  
  viewMembersBtn.addEventListener("click", () => {
    const selectedServer = window.selectedServer || selectedServer;
    if (!selectedServer) {
      alert("❌ Please select a server first.");
      return;
    }
    showMemberManagementModal(selectedServer.id);
  }, true); // Use capture to override existing listener
}

// Initialize member management features
document.addEventListener("DOMContentLoaded", () => {
  console.log("🔄 Initializing member management...");
  
  // Add role management buttons
  addRoleManagementButtons();
  
  // Override view members button
  overrideViewMembersButton();
  
  console.log("✅ Member management initialized!");
});

// Export functions for direct use
export { showMemberManagementModal, getCurrentUserRole };
