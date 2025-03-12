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

    // Add event listeners for settings buttons
    const deleteServerBtn = document.getElementById("deleteServer");
    const manageMembersBtn = document.getElementById("manageMembers");
    const addMemberBtn = document.getElementById("addMember");
    const deleteChannelBtn = document.getElementById("deleteChannel");
    const manageChannelAccessBtn = document.getElementById("manageChannelAccess");
    const leaveServerBtn = document.getElementById("leaveServer");

    if (deleteServerBtn) {
        deleteServerBtn.addEventListener("click", function () {
            // We'll handle this in the main script
            settingsDropdown.style.display = "none";
        });
    }

    if (manageMembersBtn) {
        manageMembersBtn.addEventListener("click", function () {
            // We'll handle this in the main script
            settingsDropdown.style.display = "none";
        });
    }

    if (addMemberBtn) {
        addMemberBtn.addEventListener("click", function () {
            // We'll handle this in the main script
            settingsDropdown.style.display = "none";
        });
    }

    if (deleteChannelBtn) {
        deleteChannelBtn.addEventListener("click", function () {
            // We'll handle this in the main script
            settingsDropdown.style.display = "none";
        });
    }

    if (manageChannelAccessBtn) {
        manageChannelAccessBtn.addEventListener("click", function () {
            // We'll handle this in the main script
            settingsDropdown.style.display = "none";
        });
    }

    if (leaveServerBtn) {
        leaveServerBtn.addEventListener("click", function () {
            // We'll handle this in the main script
            settingsDropdown.style.display = "none";
        });
    }
});
