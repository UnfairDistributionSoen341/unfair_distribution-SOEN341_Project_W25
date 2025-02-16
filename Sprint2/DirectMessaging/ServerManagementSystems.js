// Base User class
class User {

}

// Member class (inherits from User)
class Member extends User {
  constructor(username) {
        super(username);
        this.role = "member"; // Override role to "owner"
    }
  viewMessages(channel) {
    if (!channel) return [];
    return channel.messages; // View all messages in the channel
  }

  sendMessage(channel, messageText) {
    if (!channel || !messageText) return;
    channel.addMessage(this, messageText); // Send message to the channel
  }

}

// Admin class (inherits from User)
class Admin extends User {

}

// Owner class (inherits from Admin)
class Owner extends Admin {

}

// Server class
class Server {
}

