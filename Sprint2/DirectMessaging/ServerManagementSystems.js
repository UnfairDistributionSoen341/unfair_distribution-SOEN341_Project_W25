// Base User class
class User {

}

// Member class (inherits from User)
class Member extends User {
  constructor(username) {
        super(username);
        this.role = "member"; // Override role to "member"
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
  constructor(username) {
        super(username);
        this.role = "admin";// Override role to "owner"
        this.servers = [];
    }
  // Server Management
  createServer(serverName) {
    const server = new Server(serverName, this);
    this.servers.push(server);
    return server;
  }

  deleteServer(server) {
    const index = this.servers.findIndex(s => s.name === server.name);
    if (index !== -1) this.servers.splice(index, 1);
  }

  // Channel Management
  createChannel(server, channelName) {
    server.addChannel(channelName);
  }

  deleteChannel(server, channelName) {
    server.removeChannel(channelName);
  }

  // Team Management
  createTeam(server, teamName) {
    server.addTeam(teamName);
  }

  // Assign Users to Channels
  assignUserToChannel(user, channel) {
    channel.addUser(user);
  }

}

// Owner class (inherits from Admin)
class Owner extends Admin {

}

// Server class
class Server {
}

