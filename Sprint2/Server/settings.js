document.addEventListener("DOMContentLoaded", function () {
    const settingsButton = document.getElementById("settingsButton");
    const settingsDropdown = document.getElementById("settingsDropdown");

    // Toggle the dropdown when clicking the settings button
    settingsButton.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent click from propagating
        settingsDropdown.style.display = settingsDropdown.style.display === "block" ? "none" : "block";
    });

    // Prevent clicks inside the dropdown from closing it
    settingsDropdown.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    // Close dropdown if clicking outside
    document.addEventListener("click", function () {
        settingsDropdown.style.display = "none";
    });

    // Add event listeners for delete server and role management
    const deleteServerBtn = document.getElementById("deleteServer");
    const promoteToAdminBtn = document.getElementById("promoteToAdmin");
    const demoteToMemberBtn = document.getElementById("demoteToMember");

    if (deleteServerBtn) {
        deleteServerBtn.addEventListener("click", function () {
            // We'll handle this in the main script
            settingsDropdown.style.display = "none";
        });
    }

    if (promoteToAdminBtn) {
        promoteToAdminBtn.addEventListener("click", function () {
            // We'll handle this in currentMembers.js
            settingsDropdown.style.display = "none";
        });
    }

    if (demoteToMemberBtn) {
        demoteToMemberBtn.addEventListener("click", function () {
            // We'll handle this in currentMembers.js
            settingsDropdown.style.display = "none";
        });
    }
});
