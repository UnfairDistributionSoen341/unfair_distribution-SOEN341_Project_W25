// Import Firebase modules
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Get Firebase instances
const db = getDatabase();
const auth = getAuth();

// Initialize settings when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Wait for a moment to ensure other scripts have initialized
    setTimeout(() => {
        initSettings();
    }, 500);
});

// Make settings init function available globally
window.initSettings = initSettings;

function initSettings() {
    console.log("Initializing settings...");
    
    const settingsButton = document.getElementById("settingsButton");
    const settingsDropdown = document.getElementById("settingsDropdown");

    if (!settingsButton || !settingsDropdown) {
        console.error("Settings elements not found");
        return;
    }

    // Remove existing listeners to prevent duplicates
    const newSettingsButton = settingsButton.cloneNode(true);
    settingsButton.parentNode.replaceChild(newSettingsButton, settingsButton);
    
    // Add new click listener
    newSettingsButton.addEventListener("click", function (event) {
        event.stopPropagation();
        console.log("Settings button clicked");
        settingsDropdown.style.display = settingsDropdown.style.display === "block" ? "none" : "block";
    });

    // Prevent clicks inside dropdown from closing it
    settingsDropdown.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    // Close dropdown when clicking elsewhere
    document.addEventListener("click", function () {
        settingsDropdown.style.display = "none";
    });

    // We'll handle only the deleteServer button here and ensure it doesn't conflict with the member mgmt
    const deleteServerBtn = document.getElementById("deleteServer");
    if (deleteServerBtn) {
        // Remove existing listeners
        const newDeleteServerBtn = deleteServerBtn.cloneNode(true);
        deleteServerBtn.parentNode.replaceChild(newDeleteServerBtn, deleteServerBtn);
        
        newDeleteServerBtn.addEventListener("click", async function () {
            const selectedServer = window.selectedServer;
            if (!selectedServer) {
                alert("❌ Please select a server first.");
                return;
            }

            try {
                // Get the server details to verify ownership
                const serverRef = ref(db, `servers/${selectedServer.id}`);
                const serverSnapshot = await get(serverRef);
                
                if (!serverSnapshot.exists()) {
                    alert("❌ Server not found.");
                    return;
                }
                
                const server = serverSnapshot.val();
                
                // Check if the current user is the owner
                if (server.createdBy !== auth.currentUser.uid) {
                    alert("❌ Only the server owner can delete the server.");
                    return;
                }

                if (confirm(`Are you sure you want to delete the server "${selectedServer.name}"?`)) {
                    await set(ref(db, `servers/${selectedServer.id}`), null);
                    alert(`✅ Server "${selectedServer.name}" has been deleted.`);
                    window.location.reload();
                }
            } catch (error) {
                console.error("❌ Error deleting server:", error);
                alert("Failed to delete server.");
            }
        });
    }
    
    console.log("Settings initialized successfully!");
}

// Check for member management buttons and only add them if they don't exist
function checkMemberButtons() {
    const settingsDropdown = document.getElementById("settingsDropdown");
    if (!settingsDropdown) return;
    
    const viewMembersBtn = document.getElementById("viewMembers");
    const addMemberBtn = document.getElementById("addMember");
    const removeMemberBtn = document.getElementById("removeMember");
    const promoteToAdminBtn = document.getElementById("promoteToAdmin");
    const demoteToMemberBtn = document.getElementById("demoteToMember");
    
    if (!viewMembersBtn && !document.querySelector("button#viewMembers")) {
        const btn = document.createElement("button");
        btn.id = "viewMembers";
        btn.innerHTML = "👥 Current Members";
        settingsDropdown.appendChild(btn);
    }
    
    if (!addMemberBtn && !document.querySelector("button#addMember")) {
        const btn = document.createElement("button");
        btn.id = "addMember";
        btn.innerHTML = "➕ Add Member";
        settingsDropdown.appendChild(btn);
    }
    
    if (!removeMemberBtn && !document.querySelector("button#removeMember")) {
        const btn = document.createElement("button");
        btn.id = "removeMember";
        btn.innerHTML = "➖ Remove Member";
        settingsDropdown.appendChild(btn);
    }
    
    if (!promoteToAdminBtn && !document.querySelector("button#promoteToAdmin")) {
        const btn = document.createElement("button");
        btn.id = "promoteToAdmin";
        btn.innerHTML = "⭐ Promote to Admin";
        settingsDropdown.appendChild(btn);
    }
    
    if (!demoteToMemberBtn && !document.querySelector("button#demoteToMember")) {
        const btn = document.createElement("button");
        btn.id = "demoteToMember";
        btn.innerHTML = "⬇ Demote to Member";
        settingsDropdown.appendChild(btn);
    }
    
    // Let the member management script handle these buttons
    console.log("Member management buttons have been checked and added if needed");
}

// Call this function when the window loads to ensure all elements exist
window.addEventListener("load", checkMemberButtons);
