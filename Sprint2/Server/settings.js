document.addEventListener("DOMContentLoaded", function () {
    const settingsButton = document.getElementById("settingsButton");
    const settingsDropdown = document.getElementById("settingsDropdown");

    // Toggle the dropdown when clicking the settings button
    settingsButton.addEventListener("click", function () {
        settingsDropdown.style.display = settingsDropdown.style.display === "block" ? "none" : "block";
    });

    // Close dropdown if clicking outside
    document.addEventListener("click", function (event) {
        if (!settingsButton.contains(event.target) && !settingsDropdown.contains(event.target)) {
            settingsDropdown.style.display = "none";
        }
    });
});