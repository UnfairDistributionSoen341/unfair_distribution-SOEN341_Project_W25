* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.chat-container {
    display: flex;
    width: 80%;
    height: 600px;
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
}

.sidebar {
    width: 30%;
    background: #333;
    color: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
}

.server-section {
    margin-bottom: 20px;
    /* Add display property */
    display: flex;
    flex-direction: column;
}

h2 {
    margin-bottom: 15px;
}

h3 {
    margin-bottom: 10px;
    font-size: 16px;
    color: #aaa;
}

#searchServer, #searchChannel {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: none;
    margin-bottom: 10px;
}

#serverList, #channelList {
    margin-top: 15px;
    max-height: 200px;
    overflow-y: auto;
}

.server, .channel {
    padding: 10px;
    margin: 5px 0;
    cursor: pointer;
    background: #444;
    border-radius: 5px;
    transition: background 0.3s;
}

.server:hover, .channel:hover {
    background: #5865F2;
}

.server.active {
    background: #5865F2;
}

/* Fix for channel section display */
.channel-section {
    display: none;
    flex-direction: column;
    flex-grow: 1;
    overflow-y: auto;
}

.channel-section.active {
    display: flex;
}

.back-button {
    background: #555;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 15px;
    width: fit-content;
}

.back-button:hover {
    background: #666;
}

.divider {
    height: 1px;
    background-color: #555;
    margin: 15px 0;
}

.chat-box {
    width: 70%;
    display: flex;
    flex-direction: column;
}

#messages {
    flex-grow: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.message {
    padding: 12px;
    border-radius: 8px;
    max-width: 80%;
    word-break: break-word;
}

.sent {
    background: #007bff;
    color: white;
    align-self: flex-end;
}

.received {
    background: #f1f1f1;
    color: black;
    align-self: flex-start;
}

.message-header {
    font-weight: bold;
    margin-bottom: 4px;
    font-size: 0.9em;
}

.message-text {
    margin: 4px 0;
}

.message-time {
    font-size: 0.75em;
    opacity: 0.8;
    text-align: right;
}

.message-input {
    display: flex;
    padding: 15px;
    background: #fff;
    border-top: 1px solid #ddd;
}

#messageInput {
    flex-grow: 1;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-right: 10px;
}

#messageInput:disabled {
    background: #eee;
    cursor: not-allowed;
}

button {
    background: #007bff;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}

button:hover {
    background: #0056b3;
}

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
    position: relative;
}

.settings-container {
    position: relative;
    display: inline-block;
}

#settingsButton {
    background-color: #333;
    color: white;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 14px;
    border-radius: 5px;
}

.dropdown-menu {
    display: none; /* 🔹 Hides the dropdown by default */
    position: absolute;
    right: 0;
    top: 40px;
    background: white;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    width: 150px;
    text-align: left;
    z-index: 10;
}

.dropdown-menu button {
    display: block;
    width: 100%;
    padding: 10px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 14px;
    color:#333;
}

.dropdown-menu button:hover {
    background-color: #f1f1f1;
}

/* add member popup Styles */
.popUp {
    display: none;
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
    z-index: 100;
}

.popUp-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    text-align: center;
    position: relative;
}

.close-button {
    position: absolute;
    top: 10px; right: 15px;
    font-size: 18px;
    cursor: pointer;
}

#logoutButton {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background-color: red;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
}

/* Member modal styling */
.member-item {
    padding: 10px;
    margin-bottom: 10px;
    background-color: #f1f1f1;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Button styles for role management */
#promoteToAdmin {
    background-color: #4CAF50;
    color: white;
}

#promoteToAdmin:hover {
    background-color: #3e8e41;
}

#demoteToMember {
    background-color: #f44336;
    color: white;
}

#demoteToMember:hover {
    background-color: #d32f2f;
}

#deleteServer {
    background-color: #ff0000;
    color: white;
}

#deleteServer:hover {
    background-color: #cc0000;
}

/* Member item styles */
.member-item {
    padding: 10px;
    margin-bottom: 10px;
    background-color: #f1f1f1;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Member action buttons */
.member-action-btn {
    padding: 5px 10px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    margin-left: 5px;
}

.promote-btn {
    background-color: #4CAF50;
    color: white;
}

.demote-btn {
    background-color: #f44336;
    color: white;
}

.remove-btn {
    background-color: #9e9e9e;
    color: white;
}
