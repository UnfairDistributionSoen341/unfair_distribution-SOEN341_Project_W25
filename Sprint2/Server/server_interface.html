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
        super(username, "member");
    }

    // View messages in a channel
    viewMessages(channel) {
        if (!channel) return [];
        return channel.messages; // View all messages in the channel
    }

    // Send a message to a channel
    sendMessage(channel, messageText) {
        if (!channel || !messageText) return;
        channel.addMessage(this, messageText); // Send message to the channel
    }
}

// Admin class (inherits from User)
class Admin extends User {
    constructor(username) {
        super(username, "admin");
        this.servers = [];
    }

    // Create a new channel in a server
    createChannel(server, channelName) {
        server.addChannel(channelName);
    }

    // Delete a channel from a server
    deleteChannel(server, channelName) {
        server.removeChannel(channelName);
    }

    // Create a new team in a server
    createTeam(server, teamName) {
        server.addTeam(teamName);
    }

    // Assign a user to a channel
    assignUserToChannel(user, channel) {
        channel.addUser(user);
    }

    // Restrict a user's access to a channel
    restrictUserAccess(user, channel) {
        channel.removeUser(user);
    }

    // Delete a message from a channel
    deleteMessage(channel, messageId) {
        channel.deleteMessage(messageId);
    }
}

// Owner class (inherits from Admin)
class Owner extends Admin {
    constructor(username) {
        super(username);
        this.role = "owner"; // Override role to "owner"
    }

    // Create a new server
    createServer(serverName) {
        const server = new Server(serverName, this);
        this.servers.push(server);
        return server;
    }

    // Delete a server
    deleteServer(server) {
        const index = this.servers.findIndex(s => s.name === server.name);
        if (index !== -1) this.servers.splice(index, 1);
    }

    // Promote a member to admin
    promoteToAdmin(member, server) {
        if (member.role === "member") {
            const newAdmin = new Admin(member.username);
            server.members = server.members.filter(m => m.username !== member.username);
            server.admins.push(newAdmin);
            console.log(`${member.username} has been promoted to admin by ${this.username}.`);
        } else {
            console.log(`${member.username} is not a member and cannot be promoted.`);
        }
    }

    // Demote an admin to member
    demoteAdminToMember(admin, server) {
        if (admin.role === "admin") {
            const newMember = new Member(admin.username);
            server.admins = server.admins.filter(a => a.username !== admin.username);
            server.members.push(newMember);
            console.log(`${admin.username} has been demoted to member by ${this.username}.`);
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
        this.teams = [];
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

    // Add a channel to the server
    addChannel(channelName) {
        const channel = new Channel(channelName);
        this.channels.push(channel);
        console.log(`Channel '${channelName}' has been added to the server.`);
    }

    // Remove a channel from the server
    removeChannel(channelName) {
        const index = this.channels.findIndex(c => c.name === channelName);
        if (index !== -1) {
            this.channels.splice(index, 1);
            console.log(`Channel '${channelName}' has been removed from the server.`);
        } else {
            console.log(`Channel '${channelName}' not found.`);
        }
    }

    // Add a team to the server
    addTeam(teamName) {
        this.teams.push(teamName);
        console.log(`Team '${teamName}' has been added to the server.`);
    }
}

// Channel class
class Channel {
    constructor(name) {
        this.name = name;
        this.messages = [];
        this.users = [];
    }

    // Add a message to the channel
    addMessage(user, messageText) {
        if (!user || !messageText) {
            console.log("Invalid user or message.");
            return;
        }
        const message = {
            id: Date.now().toString(),
            user: user.username,
            text: messageText,
            timestamp: new Date().toISOString()
        };
        this.messages.push(message);
        console.log(`${user.username} sent a message in ${this.name}: ${messageText}`);
    }

    // Add a user to the channel
    addUser(user) {
        if (!user) return;
        if (!this.users.includes(user)) {
            this.users.push(user);
            console.log(`${user.username} added to channel '${this.name}'.`);
        } else {
            console.log(`${user.username} is already in channel '${this.name}'.`);
        }
    }

    // Remove a user from the channel
    removeUser(user) {
        if (!user) return;
        const index = this.users.findIndex(u => u.username === user.username);
        if (index !== -1) {
            this.users.splice(index, 1);
            console.log(`${user.username} removed from channel '${this.name}'.`);
        } else {
            console.log(`${user.username} is not in channel '${this.name}'.`);
        }
    }

    // Delete a message from the channel
    deleteMessage(messageId) {
        const index = this.messages.findIndex(m => m.id === messageId);
        if (index !== -1) {
            this.messages.splice(index, 1);
            console.log(`Message with ID ${messageId} deleted from channel '${this.name}'.`);
        } else {
            console.log(`Message with ID ${messageId} not found.`);
        }
    }
}

// Example Usage
const owner = new Owner("ownerUser");
const admin = new Admin("adminUser");
const member = new Member("memberUser");

const server = owner.createServer("Main Server");
owner.promoteToAdmin(member, server); // Promote member to admin
admin.createChannel(server, "General");
admin.assignUserToChannel(member, server.channels[0]);
member.sendMessage(server.channels[0], "Hello, everyone!");
admin.deleteMessage(server.channels[0], server.channels[0].messages[0].id);
