// tests/hashUtilsNode.js - Node.js compatible version for testing
// This is a testing-friendly version of Sprint1/SignUpPage/hashUtils.js
const bcrypt = require('bcryptjs');

// Function to hash a password
exports.hashPassword = async (password) => {
    try {
        const salt = bcrypt.genSaltSync(10); // Generate a salt
        const hashedPassword = bcrypt.hashSync(password, salt); // Hash the password
        return hashedPassword;
    } catch (error) {
        console.error("❌ Error hashing password:", error);
        throw error;
    }
};

// Function to compare a password with a hashed password
exports.comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = bcrypt.compareSync(password, hashedPassword); // Compare passwords
        return isMatch;
    } catch (error) {
        console.error("❌ Error comparing passwords:", error);
        throw error;
    }
};
