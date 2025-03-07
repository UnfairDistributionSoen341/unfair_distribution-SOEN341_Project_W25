// Import Firebase modules
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    // Get Firebase instances
    const db = getDatabase();
    const auth = getAuth();
    
    const settingsButton = document.getElementById("settingsButton");
    const settingsDropdown = document.getElementById("settingsDropdown");

    settingsButton.addEventListener("click", function (event) {
        event.stopPropagation();
        settingsDropdown.style.display = settingsDropdown.style.display === "block" ? "none" : "block";
    });

    settingsDropdown.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    document.addEventListener("click", function () {
        settingsDropdown.style.display = "none";
    });

    const deleteServerBtn = document.getElementById("deleteServer");
    const promoteToAdminBtn = document.getElementById("promoteToAdmin");
    const demoteToMemberBtn = document.getElementById("demoteToMember");

    if (deleteServerBtn) {
        deleteServerBtn.addEventListener("click", function () {
            const selectedServer = window.selectedServer;
            if (!selectedServer) {
                alert("❌ Please select a server first.");
                return;
            }

            // Check if the current user is the owner
            if (selectedServer.createdBy !== auth.currentUser.uid) {
                alert("❌ Only the server owner can delete the server.");
                return;
            }

            if (confirm(`Are you sure you want to delete the server "${selectedServer.name}"?`)) {
                set(ref(db, `servers/${selectedServer.id}`), null).then(() => {
                    alert(`✅ Server "${selectedServer.name}" has been deleted.`);
                    window.location.reload();
                }).catch((error) => {
                    console.error("❌ Error deleting server:", error);
                    alert("Failed to delete server.");
                });
            }
        });
    }

    if (promoteToAdminBtn) {
        promoteToAdminBtn.addEventListener("click", function () {
            const selectedServer = window.selectedServer;
            if (!selectedServer) {
                alert("❌ Please select a server first.");
                return;
            }

            // Check if the current user is the owner
            if (selectedServer.createdBy !== auth.currentUser.uid) {
                alert("❌ Only the server owner can promote members to admin.");
                return;
            }

            // Call the displayMembers function from the window object
            if (typeof window.displayMembers === 'function') {
                window.displayMembers(selectedServer.id);
            } else {
                alert("❌ Member management function not found.");
                console.error("displayMembers function is not available");
            }
        });
    }

    if (demoteToMemberBtn) {
        demoteToMemberBtn.addEventListener("click", function () {
            const selectedServer = window.selectedServer;
            if (!selectedServer) {
                alert("❌ Please select a server first.");
                return;
            }

            // Check if the current user is the owner
            if (selectedServer.createdBy !== auth.currentUser.uid) {
                alert("❌ Only the server owner can demote admins to member.");
                return;
            }

            // Call the displayMembers function from the window object
            if (typeof window.displayMembers === 'function') {
                window.displayMembers(selectedServer.id);
            } else {
                alert("❌ Member management function not found.");
                console.error("displayMembers function is not available");
            }
        });
    }
});
