import bcrypt from 'https://cdn.jsdelivr.net/npm/bcryptjs@2.4.3/dist/bcrypt.min.js'; // Use bcrypt.js for hashing

// Function to hash a password
export const hashPassword = async (password) => {
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
export const comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = bcrypt.compareSync(password, hashedPassword); // Compare passwords
        return isMatch;
    } catch (error) {
        console.error("❌ Error comparing passwords:", error);
        throw error;
    }
};
