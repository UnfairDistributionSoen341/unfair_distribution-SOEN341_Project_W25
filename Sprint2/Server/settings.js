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
});