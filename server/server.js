// server/server.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded, get, onValue } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// 🔥 Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// DOM Elements
const elements = {
  channelList: document.getElementById("channelList"),
  chatChannelName: document.getElementById("chatChannelName"),
  messageInput: document.getElementById("messageInput"),
  sendMessage: document.getElementById("sendMessage"),
  createChannel: document.getElementById("createChannel"),
  searchChannel: document.getElementById("searchChannel"),
  messages: document.getElementById("messages")
};

let currentUser = null;
let selectedChannel = null;

document.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  try {
    console.log("Initializing application...");
    setupAuthState();
    attachEventListeners();
    elements.messageInput.disabled = true;
  } catch (error) {
    console.error("Initialization error:", error);
    alert("Application initialization failed");
  }
}

function setupAuthState() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      console.log("Authenticated user:", user.email);
      setupRealTimeListeners();
    } else {
      console.log("No authenticated user, redirecting...");
      window.location.href = "/login.html";
    }
  });
}

function attachEventListeners() {
  elements.sendMessage.addEventListener("click", sendMessage);
  elements.createChannel.addEventListener("click", handleCreateChannel);
  elements.messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
  elements.searchChannel.addEventListener("input", filterChannels);
}

function setupRealTimeListeners() {
  const channelsRef = ref(db, "channels");
  onValue(channelsRef, (snapshot) => {
    try {
      const channels = [];
      snapshot.forEach(child => {
        channels.push({
          id: child.key,
          ...child.val()
        });
      });
      displayChannels(channels);
    } catch (error) {
      console.error("Channel load error:", error);
    }
  });
}

function displayChannels(channels) {
  elements.channelList.innerHTML = channels.length ? 
    channels.map(channel => `
      <div class="channel" data-id="${channel.id}">
        ${channel.name}
        ${channel.admin === currentUser.uid ? '<span class="admin-badge">(Admin)</span>' : ''}
      </div>
    `).join('') : 
    '<div class="no-channels">No channels available</div>';

  document.querySelectorAll('.channel').forEach(channel => {
    channel.addEventListener('click', () => {
      const selected = channels.find(c => c.id === channel.dataset.id);
      joinChannel(selected);
    });
  });
}

async function joinChannel(channel) {
  try {
    console.log("Joining channel:", channel.name);
    const memberRef = ref(db, `channels/${channel.id}/members/${currentUser.uid}`);
    const snapshot = await get(memberRef);

    if (!snapshot.exists()) {
      throw new Error("User not in channel members");
    }

    selectedChannel = channel;
    elements.chatChannelName.textContent = `# ${channel.name}`;
    elements.messageInput.disabled = false;
    loadMessages();
  } catch (error) {
    console.error("Channel join error:", error);
    alert("You don't have permission to access this channel");
  }
}

function loadMessages() {
  elements.messages.innerHTML = '';
  const messagesRef = ref(db, `channels/${selectedChannel.id}/messages`);

  onChildAdded(messagesRef, (snapshot) => {
    try {
      const msg = snapshot.val();
      createMessageElement(msg);
    } catch (error) {
      console.error("Message load error:", error);
    }
  });
}

function createMessageElement(msg) {
  try {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${msg.senderId === currentUser.uid ? "sent" : "received"}`;
    messageDiv.innerHTML = `
      <div class="message-header">${msg.senderName}</div>
      <div class="message-text">${msg.text}</div>
      <div class="message-time">${formatTimestamp(msg.timestamp)}</div>
    `;
    elements.messages.appendChild(messageDiv);
    elements.messages.scrollTop = elements.messages.scrollHeight;
  } catch (error) {
    console.error("Message display error:", error);
  }
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function handleCreateChannel() {
  try {
    const channelName = prompt("Enter new channel name:");
    if (!channelName?.trim()) return;

    const newChannelRef = push(ref(db, "channels"));
    await set(newChannelRef, {
      id: newChannelRef.key,
      name: channelName.trim(),
      admin: currentUser.uid,
      members: { [currentUser.uid]: true }
    });

    await addUsersToChannel(newChannelRef.key);
    alert("Channel created successfully!");
  } catch (error) {
    console.error("Channel creation failed:", error);
    alert("Failed to create channel");
  }
}

async function addUsersToChannel(channelId) {
  let addMore = true;
  while (addMore) {
    const userEmail = prompt("Enter user's email to add (cancel to stop):");
    if (!userEmail) break;

    try {
      const usersRef = ref(db, "users");
      const snapshot = await get(usersRef);
      let userFound = false;

      snapshot.forEach(child => {
        const user = child.val();
        if (user.email === userEmail) {
          userFound = true;
          set(ref(db, `channels/${channelId}/members/${child.key}`), true)
            .then(() => console.log(`Added ${userEmail} to channel`))
            .catch(err => console.error("Add user error:", err));
        }
      });

      if (!userFound) {
        alert("User not found. Please check the email address.");
      }
    } catch (error) {
      console.error("User lookup error:", error);
    }
    addMore = confirm("Add another user?");
  }
}

async function sendMessage() {
  try {
    if (!selectedChannel) {
      alert("Please select a channel first!");
      return;
    }

    const messageText = elements.messageInput.value.trim();
    if (!messageText) return;

    const messagesRef = ref(db, `channels/${selectedChannel.id}/messages`);
    await push(messagesRef, {
      text: messageText,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || currentUser.email,
      timestamp: Date.now()
    });

    elements.messageInput.value = "";
  } catch (error) {
    console.error("Message send error:", error);
    alert("Failed to send message");
  }
}

function filterChannels() {
  const searchTerm = elements.searchChannel.value.toLowerCase();
  document.querySelectorAll('.channel').forEach(channel => {
    const channelName = channel.textContent.toLowerCase();
    channel.style.display = channelName.includes(searchTerm) ? "block" : "none";
  });
}