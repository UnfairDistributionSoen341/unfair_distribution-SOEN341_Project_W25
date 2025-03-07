import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Get database and auth instances
const db = getDatabase();
const auth = getAuth();

// Get the current user's role
async function getCurrentUserRole(serverId, userId) {
  // Use the global function if it's already defined
  if (window.getCurrentUserRole && serverId !== undefined && userId !== undefined) {
    return window.getCurrentUserRole(serverId, userId);
  }
  
  if (!serverId || !userId) return "member";
  
  try {
    // First check if the user is the creator (owner)
    const serverRef = ref(db, `servers/${serverId}`);
    const serverSnapshot = await get(serverRef);
    
    if (serverSnapshot.exists() && serverSnapshot.val().createdBy === userId) {
      return "owner";
    }
    
    // If not the owner, check member role
    const memberRef = ref(db, `servers/${serverId}/members/${userId}`);
    const snapshot = await get(memberRef);
    
    if (!snapshot.exists()) return "member";
    
    // Handle both string username and object with role
    const memberData = snapshot.val();
    if (typeof memberData === "object" && memberData.role) {
      return memberData.role;
    }
    
    // Default to member if no role specified
    return "member";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "member";
  }
}

// Delegate to main displayMembers function if it exists
async function showMemberManagementModal(serverId) {
  // Use the global displayMembers function if it exists
  if (typeof window.displayMembers === 'function') {
    console.log("Using global displayMembers function");
    window.displayMembers(serverId);
    return;
  }
  
  console.warn("Global displayMembers function not found. This is a fallback implementation.");
  
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
    
    alert("Member management functionality is temporarily unavailable. Please try again later.");
    console.error("Fallback member management not implemented. Missing displayMembers function.");
  } catch (error) {
    console.error("Error showing member management:", error);
    alert("❌ Failed to load member management. See console for details.");
  }
}

// Initialize by checking for the primary member management functions
function initializeMemberHandler() {
  console.log("Initializing memberHandler.js...");
  
  // Add event listeners only if global functions don't exist
  if (typeof window.displayMembers !== 'function') {
    console.warn("Global displayMembers function not found. Setting up fallback mechanisms.");
    
    const viewMembersBtn = document.getElementById("viewMembers");
    if (viewMembersBtn) {
      viewMembersBtn.addEventListener("click", () => {
        const selectedServer = window.selectedServer;
        if (selectedServer) {
          showMemberManagementModal(selectedServer.id);
        } else {
          alert("❌ Please select a server first.");
        }
      });
    }
  } else {
    console.log("Global displayMembers function found. Using that instead.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Wait a moment to ensure other scripts have loaded
  setTimeout(() => {
    initializeMemberHandler();
  }, 500);
});

// Make sure the important functions are available globally
window.showMemberManagementModal = showMemberManagementModal;

// Delegate to the main displayMembers function if it exists
if (typeof window.displayMembers !== 'function') {
  window.displayMembers = function(serverId) {
    showMemberManagementModal(serverId);
  };
}

// Export as ES modules for import
export { showMemberManagementModal, getCurrentUserRole };
