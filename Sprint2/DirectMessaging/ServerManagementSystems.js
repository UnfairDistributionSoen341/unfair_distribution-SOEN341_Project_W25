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

}

// Admin class (inherits from User)
class Admin extends User {

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

