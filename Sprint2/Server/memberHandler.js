import { getDatabase, ref, get, set, remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Get database and auth instances
const db = getDatabase();
const auth = getAuth();

// Get the current user's role
async function getCurrentUserRole(serverId, userId) {
  if (!serverId || !userId) return "member";
  
  try {
    console.log(`Checking role for user ${userId} in server ${serverId}`);
    
    // Check if user is server creator (owner)
    const serverRef = ref(db, `servers/${serverId}`);
    const serverSnapshot = await get(serverRef);
    
    if (serverSnapshot.exists()) {
      const server = serverSnapshot.val();
      // If user is the server creator, they are the owner
      if (server.createdBy === userId) {
        console.log("User is server creator -> OWNER");
        return "owner";
      }
    }
    
    // Otherwise check their role in members
    const memberRef = ref(db, `servers/${serverId}/members/${userId}`);
    const snapshot = await get(memberRef);
    
    if (!snapshot.exists()) {
      console.log("User not found in members");
      return "member";
    }
    
    // Handle both string username and object with role
    const memberData = snapshot.val();
    console.log("Member data:", memberData);
    
    if (typeof memberData === "object" && memberData.role) {
      console.log(`Found role: ${memberData.role}`);
      return memberData.role;
    }
    
    // If it's just a username string or no role specified
    console.log("No role specified, defaulting to member");
    return "member";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "member";
  }
}

// Check if user can access a channel (used in the main script but defined here for consistency)
async function canAccessChannel(serverId, channelId, userId) {
  // Owners and admins always have access
  const userRole = await getCurrentUserRole(serverId, userId);
  if (userRole === "owner" || userRole === "admin") {
    return true;
  }
  
  // For regular members, check allowedMembers
  const allowedRef = ref(db, `servers/${serverId}/channels/${channelId}/allowedMembers/${userId}`);
  const allowedSnapshot = await get(allowedRef);
  return allowedSnapshot.exists();
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
    const userRole = await getCurrentUserRole(serverId, currentUserId);
    
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
    
    // Get server data to identify owner
    const serverRef = ref(db, `servers/${serverId}`);
    const serverSnapshot = await get(serverRef);
    const server = serverSnapshot.val();
    
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
      
      // Only show actions if current user has proper permissions
      // Owner can do everything
      if (userRole === "owner" && memberId !== currentUserId) {
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
              await remove(ref(db, `servers/${serverId}/members/${memberId}`));
              alert(`✅ ${username} has been removed from the server!`);
              document.body.removeChild(modal);
              showMemberManagementModal(serverId); // Refresh with updated members
            }
          };
          
          actionButtons.appendChild(removeBtn);
        }
      } 
      // Admin can remove regular members, but not other admins or owner
      else if (userRole === "admin" && role === "member" && memberId !== currentUserId) {
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
            await remove(ref(db, `servers/${serverId}/members/${memberId}`));
            alert(`✅ ${username} has been removed from the server!`);
            document.body.removeChild(modal);
            showMemberManagementModal(serverId); // Refresh with updated members
          }
        };
        
        actionButtons.appendChild(removeBtn);
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

// Channel access management modal
async function showChannelAccessModal(serverId, channelId) {
  if (!serverId || !channelId) {
    alert("❌ Please select a server and channel first.");
    return;
  }

  try {
    const currentUserId = auth.currentUser.uid;
    const userRole = await getCurrentUserRole(serverId, currentUserId);
    if (userRole !== "admin" && userRole !== "owner") {
      alert("❌ Only admins and owners can manage channel access.");
      return;
    }

    const membersRef = ref(db, `servers/${serverId}/members`);
    const membersSnapshot = await get(membersRef);
    
    if (!membersSnapshot.exists()) {
      alert("❌ No members found in this server.");
      return;
    }

    const allowedMembersRef = ref(db, `servers/${serverId}/channels/${channelId}/allowedMembers`);
    const allowedSnapshot = await get(allowedMembersRef);

    const modal = document.createElement("div");
    modal.className = "popUp";
    modal.id = "channelAccessModal";
    modal.style.display = "flex";

    const modalContent = document.createElement("div");
    modalContent.className = "popUp-content";
    modalContent.style.width = "400px";
    modalContent.style.maxHeight = "80vh";
    modalContent.style.overflowY = "auto";

    const closeButton = document.createElement("span");
    closeButton.className = "close-button";
    closeButton.innerHTML = "&times;";
    closeButton.onclick = () => document.body.removeChild(modal);

    const title = document.createElement("h2");
    title.textContent = "Manage Channel Access";
    title.style.marginBottom = "20px";

    const membersList = document.createElement("div");
    membersList.style.textAlign = "left";

    // Get server data to identify owner
    const serverRef = ref(db, `servers/${serverId}`);
    const serverSnapshot = await get(serverRef);
    const server = serverSnapshot.val();

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
      
      // Skip admins and owners in the access management list (they always have access)
      if (role === "admin" || memberId === server.createdBy) {
        return;
      }

      const memberItem = document.createElement("div");
      memberItem.className = "channel-access-item";

      const memberInfo = document.createElement("div");
      memberInfo.innerHTML = `<strong>${username}</strong>`;

      const actionBtn = document.createElement("button");
      actionBtn.className = `channel-access-button ${
        allowedSnapshot.exists() && allowedSnapshot.hasChild(memberId) 
          ? "remove-access" 
          : "allow-access"
      }`;

      actionBtn.textContent = allowedSnapshot.exists() && allowedSnapshot.hasChild(memberId)
        ? "Remove Access"
        : "Allow Access";

      actionBtn.onclick = async () => {
        const path = `servers/${serverId}/channels/${channelId}/allowedMembers/${memberId}`;
        if (allowedSnapshot.exists() && allowedSnapshot.hasChild(memberId)) {
          await remove(ref(db, path));
        } else {
          await set(ref(db, path), true);
        }
        modal.remove();
        showChannelAccessModal(serverId, channelId);
      };

      memberItem.appendChild(memberInfo);
      memberItem.appendChild(actionBtn);
      membersList.appendChild(memberItem);
    });

    modalContent.appendChild(closeButton);
    modalContent.appendChild(title);
    modalContent.appendChild(membersList);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  } catch (error) {
    console.error("Error managing channel access:", error);
    alert("❌ Failed to load channel access management.");
  }
}

// Initialize event listeners
document.addEventListener("DOMContentLoaded", () => {
  console.log("🔄 Initializing member management...");
  
  // Override view members button
  const viewMembersBtn = document.getElementById("viewMembers");
  if (viewMembersBtn) {
    viewMembersBtn.addEventListener("click", () => {
      const selectedServer = window.selectedServer;
      
      if (selectedServer) {
        showMemberManagementModal(selectedServer.id);
      } else {
        alert("❌ Please select a server first.");
      }
    }, true); // Use capture to override existing listener
  }
  
  // Add listeners for delete server button
  const deleteServerBtn = document.getElementById("deleteServer");
  if (deleteServerBtn) {
    deleteServerBtn.addEventListener("click", async () => {
      const selectedServer = window.selectedServer;
      if (!selectedServer) {
        alert("❌ Please select a server first.");
        return;
      }
      
      // Check if user is owner
      const userRole = await getCurrentUserRole(selectedServer.id, auth.currentUser.uid);
      if (userRole !== "owner") {
        alert("❌ Only the server owner can delete the server.");
        return;
      }
      
      if (confirm(`Are you sure you want to delete the server "${selectedServer.name}"? This action cannot be undone.`)) {
        try {
          await remove(ref(db, `servers/${selectedServer.id}`));
          alert(`✅ Server "${selectedServer.name}" has been deleted.`);
          window.location.reload(); // Reload to update server list
        } catch (error) {
          console.error("Error deleting server:", error);
          alert("❌ Failed to delete server. See console for details.");
        }
      }
    });
  }
  
  console.log("✅ Member management initialized!");
});

// Export functions for use in main script
export { getCurrentUserRole, showMemberManagementModal, showChannelAccessModal, canAccessChannel };

// Make showMemberManagementModal available globally
window.showMemberManagementModal = showMemberManagementModal;
