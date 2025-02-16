let selectedUserId = null;

function showContextMenu(event, userId) {
    event.preventDefault();
    selectedUserId = userId;
    
    const contextMenu = document.getElementById('context-menu');
    contextMenu.style.top = `${event.clientY}px`;
    contextMenu.style.left = `${event.clientX}px`;
    contextMenu.style.display = 'block';
}

window.addEventListener('click', () => {
    const contextMenu = document.getElementById('context-menu');
    contextMenu.style.display = 'none';
});

function reportUser() {
    if (selectedUserId) {
        alert(`User ${selectedUserId} has been reported.`);
    }
    closeContextMenu();
}

function blockUser() {
    if (selectedUserId) {
        alert(`User ${selectedUserId} has been blocked.`);
    }
    closeContextMenu();
}

function closeContextMenu() {
    const contextMenu = document.getElementById('context-menu');
    contextMenu.style.display = 'none';
}
