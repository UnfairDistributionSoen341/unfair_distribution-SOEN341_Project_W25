// tests/hashUtils.test.js
import bcrypt from 'bcryptjs';

// Mock the bcrypt module for testing
jest.mock('bcryptjs', () => ({
  genSaltSync: jest.fn(() => 'mockedSalt'),
  hashSync: jest.fn(() => 'hashedPassword123'),
  compareSync: jest.fn((password, hash) => password === 'SecureTest123!' && hash === 'hashedPassword123')
}));

// Import our functions
// Note: For Node.js testing, we're importing a Node-compatible version of these functions
const { hashPassword, comparePassword } = require('./hashUtilsNode');

describe("Password Hashing Tests", () => {
    beforeEach(() => {
        // Clear mock calls between tests
        jest.clearAllMocks();
    });

    test("✅ Successfully hashes a password", async () => {
        const password = "SecureTest123!";
        const hashedPassword = await hashPassword(password);
        
        // Verify bcrypt functions were called correctly
        expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
        expect(bcrypt.hashSync).toHaveBeenCalledWith(password, 'mockedSalt');
        
        // Verify the result
        expect(hashedPassword).toBe('hashedPassword123');
        expect(hashedPassword).not.toBe(password);
    });

    test("✅ Successfully verifies correct password", async () => {
        const password = "SecureTest123!";
        const hashedPassword = "hashedPassword123";
        const isValid = await comparePassword(password, hashedPassword);
        
        // Verify bcrypt.compareSync was called correctly
        expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword);
        
        // Verify the result
        expect(isValid).toBe(true);
    });

    test("❌ Fails verification for incorrect password", async () => {
        const password = "WrongPassword!";
        const hashedPassword = "hashedPassword123";
        const isValid = await comparePassword(password, hashedPassword);
        
        // Verify bcrypt.compareSync was called correctly
        expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword);
        
        // Verify the result
        expect(isValid).toBe(false);
    });

    test("✅ Handles errors in hashPassword function", async () => {
        // Spy on console.error to prevent output in tests
        jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // Make genSaltSync throw an error for this test
        bcrypt.genSaltSync.mockImplementationOnce(() => {
            throw new Error("Salt generation failed");
        });

        await expect(hashPassword("password123")).rejects.toThrow("Salt generation failed");
        
        // Restore console.error
        console.error.mockRestore();
    });

    test("✅ Handles errors in comparePassword function", async () => {
        // Spy on console.error to prevent output in tests
        jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // Make compareSync throw an error for this test
        bcrypt.compareSync.mockImplementationOnce(() => {
            throw new Error("Compare failed");
        });

        await expect(comparePassword("password123", "hashedValue")).rejects.toThrow("Compare failed");
        
        // Restore console.error
        console.error.mockRestore();
    });
});
