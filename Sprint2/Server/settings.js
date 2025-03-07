// Import Firebase modules
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Get Firebase instances
const db = getDatabase();
const auth = getAuth();

// Initialize settings when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Initialize settings with a slight delay to ensure DOM is loaded
    setTimeout(() => {
        initSettings();
    }, 300);
});

// Make settings init function available globally
window.initSettings = initSettings;

// Main settings initialization
function initSettings() {
    console.log("Initializing settings dropdown...");
    
    const settingsButton = document.getElementById("settingsButton");
    const settingsDropdown = document.getElementById("settingsDropdown");

    if (!settingsButton || !settingsDropdown) {
        console.error("Settings elements not found");
        return;
    }

    // Remove existing listeners to prevent duplicates
    const newSettingsButton = settingsButton.cloneNode(true);
    settingsButton.parentNode.replaceChild(newSettingsButton, settingsButton);
    
    // Add new click listener to toggle dropdown
    newSettingsButton.addEventListener("click", function (event) {
        event.stopPropagation();
        console.log("Settings button clicked");
        
        // Toggle dropdown visibility
        if (settingsDropdown.style.display === "block") {
            settingsDropdown.style.display = "none";
        } else {
            settingsDropdown.style.display = "block";
        }
    });

    // Prevent clicks inside dropdown from closing it
    settingsDropdown.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    // Close dropdown when clicking elsewhere
    document.addEventListener("click", function () {
        settingsDropdown.style.display = "none";
    });
    
    // Make sure the delete server button works
    setupDeleteServerButton();
    
    console.log("Settings dropdown initialized");
}

// Setup the delete server button
function setupDeleteServerButton() {
    const deleteServerBtn = document.getElementById("deleteServer");
    if (!deleteServerBtn) {
        console.log("Delete server button not found");
        return;
    }
    
    // Remove any existing listeners
    const newDeleteServerBtn = deleteServerBtn.cloneNode(true);
    deleteServerBtn.parentNode.replaceChild(newDeleteServerBtn, deleteServerBtn);
    
    // Add new click listener
    newDeleteServerBtn.addEventListener("click", async function () {
        const selectedServer = window.selectedServer;
        if (!selectedServer) {
            alert("❌ Please select a server first.");
            return;
        }

        try {
            // Get the server details
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
    
    console.log("Delete server button initialized");
}

// Run settings initialization immediately
initSettings();
