// Import Firebase modules
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Get Firebase instances
const db = getDatabase();
const auth = getAuth();

// Function to fix the create channel functionality
function fixCreateChannel() {
    console.log("Fixing create channel functionality...");
    
    const createChannelBtn = document.getElementById("createChannel");
    const createChannelPopUp = document.getElementById("createChannelPopUp");
    const confirmCreateChannelBtn = document.getElementById("confirmCreateChannel");
    const closeCreateChannelBtn = document.getElementById("closeCreateChannelPopUp");
    
    if (!createChannelBtn || !createChannelPopUp || !confirmCreateChannelBtn) {
        console.error("Create channel elements not found");
        return;
    }
    
    // Remove existing listeners
    const newCreateChannelBtn = createChannelBtn.cloneNode(true);
    createChannelBtn.parentNode.replaceChild(newCreateChannelBtn, createChannelBtn);
    
    // Define getCurrentUserRole function if it doesn't exist
    if (typeof window.getCurrentUserRole !== 'function') {
        window.getCurrentUserRole = async function(serverId, userId) {
            if (!serverId || !userId) return "member";
            
            try {
                // Check if user is creator (owner)
                const serverRef = ref(db, `servers/${serverId}`);
                const serverSnapshot = await get(serverRef);
                
                if (serverSnapshot.exists() && serverSnapshot.val().createdBy === userId) {
                    return "owner";
                }
                
                // Check member role
                const memberRef = ref(db, `servers/${serverId}/members/${userId}`);
                const memberSnapshot = await get(memberRef);
                
                if (!memberSnapshot.exists()) return "member";
                
                const memberData = memberSnapshot.val();
                if (typeof memberData === "object" && memberData.role) {
                    return memberData.role;
                }
                
                return "member";
            } catch (error) {
                console.error("Error getting user role:", error);
                return "member";
            }
        };
    }
    
    // Add click listener for the create channel button
    newCreateChannelBtn.addEventListener("click", async () => {
        const selectedServer = window.selectedServer;
        if (!selectedServer) {
            alert("❌ Please select a server first.");
            return;
        }
        
        try {
            // Check if the current user has permission
            const userRole = await window.getCurrentUserRole(selectedServer.id, auth.currentUser.uid);
            console.log("Current user role:", userRole);
            
            if (userRole !== "admin" && userRole !== "owner") {
                alert("❌ Only admins and owners can create channels.");
                return;
            }
            
            // Show the create channel popup
            createChannelPopUp.style.display = "flex";
        } catch (error) {
            console.error("Error checking user role:", error);
            alert("❌ Error checking permissions.");
        }
    });
    
    // Make sure close button works
    if (closeCreateChannelBtn) {
        closeCreateChannelBtn.addEventListener("click", () => {
            createChannelPopUp.style.display = "none";
        });
    }
    
    // Make sure confirm button works
    confirmCreateChannelBtn.addEventListener("click", async () => {
        const channelName = document.getElementById("channelNameInput").value.trim();
        const selectedServer = window.selectedServer;
        
        if (!channelName) {
            alert("Please enter a channel name.");
            return;
        }
        
        if (!selectedServer) {
            alert("❌ No server selected.");
            return;
        }
        
        try {
            // Create the channel
            const channelsRef = ref(db, `servers/${selectedServer.id}/channels`);
            await push(channelsRef, {
                name: channelName,
                createdBy: auth.currentUser.uid,
                createdAt: Date.now()
            });
            
            alert(`✅ Channel "${channelName}" created successfully!`);
            createChannelPopUp.style.display = "none";
            document.getElementById("channelNameInput").value = "";
            
            // Reload channels
            if (typeof window.loadChannels === 'function') {
                window.loadChannels(selectedServer.id);
            } else {
                console.warn("loadChannels function not found");
                window.location.reload();
            }
        } catch (error) {
            console.error("❌ Error creating channel:", error);
            alert("Failed to create channel.");
        }
    });
    
    console.log("Create channel functionality fixed");
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Set a slight delay to ensure all elements are loaded
    setTimeout(() => {
        fixCreateChannel();
    }, 500);
});

// Also run now in case DOM is already loaded
fixCreateChannel();
