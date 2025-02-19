// Base User class
class User {
    constructor(username, role) {
        this.username = username;
        this.role = role;
        this.assignedChannels = [];
    }

    // Logout functionality
    logout() {
        console.log(`${this.username} has logged out.`);
    }
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
    constructor(username) {
        super(username);
        this.role = "owner"; // Override role to "owner"
        this.servers = [];
    }

    // Owner can remove an admin
    removeAdmin(admin, server) {
        if (admin.role === "admin") {
            server.admins = server.admins.filter(a => a.username !== admin.username);
            console.log(`${admin.username} has been removed as an admin by ${this.username}.`);
        } else {
            console.log(`${admin.username} is not an admin and cannot be removed.`);
        }
    }

    // Owner can demote an admin to a member
    demoteAdminToMember(admin, server) {
        if (admin.role === "admin") {
            const newMember = new Member(admin.username);
            server.members.push(newMember);
            server.admins = server.admins.filter(a => a.username !== admin.username);
            console.log(`${admin.username} has been demoted to a member by ${this.username}.`);
        } else {
            console.log(`${admin.username} is not an admin and cannot be demoted.`);
        }
    }
}

// Server class
class Server {
    constructor(name, owner) {
        this.name = name;
        this.owner = owner;
        this.admins = [];
        this.members = [];
        this.channels = [];
    }

    // Add an admin to the server
    addAdmin(admin) {
        if (admin.role === "admin") {
            this.admins.push(admin);
            console.log(`${admin.username} has been added as an admin.`);
        } else {
            console.log(`${admin.username} is not an admin and cannot be added.`);
        }
    }

    // Add a member to the server
    addMember(member) {
        if (member.role === "member") {
            this.members.push(member);
            console.log(`${member.username} has been added as a member.`);
        } else {
            console.log(`${member.username} is not a member and cannot be added.`);
        }
    }
}

class Channel {
    constructor(name) {
        this.name = name;
        this.messages = []; 
        this.users = []; 
    }

    addMessage(user, messageText) {
        if (!user || !messageText) {
            console.log("Invalid user or message.");
            return;
        }
        this.messages.push({ user: user.username, text: messageText });
        console.log(`${user.username} sent a message in ${this.name}: ${messageText}`);
    }

    addUser(user) {
        if (!user) {
            return;
        }
        if (!this.users.includes(user)) {
            this.users.push(user);
            console.log(`${user.username} added to channel '${this.name}'.`);
        } else {
            console.log(`${user.username} is already in channel '${this.name}'.`);
        }
    }

    removeUser(user) {
        if (!user) {
            return;
        }
        const index = this.users.findIndex(u => u.username === user.username);
        if (index !== -1) {
            this.users.splice(index, 1);
            console.log(`${user.username} removed from channel '${this.name}'.`);
        } else {
            console.log(`${user.username} is not in channel '${this.name}'.`);
        }
    }

    // View all messages in the channel
    viewMessages() {
        if (this.messages.length === 0) {
            console.log(`No messages in channel '${this.name}'.`);
            return [];
        }
        return this.messages;
    }
}
