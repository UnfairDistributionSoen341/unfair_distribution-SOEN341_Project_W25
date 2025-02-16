// Base User class
class User {
    constructor(username, role) {
        this.username = username;
        this.role = role;
        this.assignedChannels = [];
    }
  
    // Assign user to a channel
    assignToChannel(channel) {
        if (!this.assignedChannels.includes(channel)) {
            this.assignedChannels.push(channel);
            console.log(`${this.username} has been assigned to ${channel}.`);
        } else {
            console.log(`${this.username} is already assigned to ${channel}.`);
        }
    }

    // Logout functionality
    logout() {
        console.log(`${this.username} has logged out.`);
    }
}

// Member class (inherits from User)
class Member extends User {

}

// Admin class (inherits from User)
class Admin extends User {

}

// Owner class (inherits from Admin)
class Owner extends Admin {
    constructor(username) {
        super(username);
        this.role = "owner"; // Override role to "owner"
    }
}

// Server class
class Server {
      constructor(username, role) {
        this.username = username;
        this.role = role;
        this.assignedChannels = [];
}

