// tests/register.test.js
// Set up manual mocks for Firebase modules
// These mocks work without requiring the actual Firebase packages to be installed
const mockFirebaseApp = {
  initializeApp: jest.fn(() => mockApp)
};

const mockApp = {
  // Mock app instance
};

const mockAuth = {
  // Mock auth instance
};

const mockDb = {
  // Mock database instance
};

// Global mocks
global.initializeApp = mockFirebaseApp.initializeApp;
global.getAuth = jest.fn(() => mockAuth);
global.createUserWithEmailAndPassword = jest.fn();
global.getDatabase = jest.fn(() => mockDb);
global.ref = jest.fn();
global.set = jest.fn();

// Mock hashUtils
jest.mock('./hashUtilsNode', () => ({
  hashPassword: jest.fn(async (password) => `hashed_${password}`),
  comparePassword: jest.fn(async (password, hashedPassword) => 
    hashedPassword === `hashed_${password}`)
}));

// Mock the DOM elements
document.body.innerHTML = `
  <form id="registerForm">
    <input id="username" type="text" />
    <input id="email" type="email" />
    <input id="password" type="password" />
    <button type="submit">Register</button>
  </form>
  <div id="message"></div>
`;

// Use the global mocks instead of importing Firebase modules
const { initializeApp } = global;
const { getAuth, createUserWithEmailAndPassword } = global;
const { getDatabase, ref, set } = global;

// Import the hashPassword function
import { hashPassword } from './hashUtilsNode';

describe('Register Page Tests', () => {
  let event;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Reset form values
    document.getElementById('username').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('message').innerText = '';
    
    // Mock event
    event = { preventDefault: jest.fn() };
  });
  
  test('Firebase is initialized correctly', () => {
    // Import register code to trigger initialization
    require('./registerNode');
    
    expect(initializeApp).toHaveBeenCalledWith(expect.objectContaining({
      apiKey: expect.any(String),
      authDomain: expect.any(String),
      databaseURL: expect.any(String),
      projectId: expect.any(String)
    }));
    
    expect(getAuth).toHaveBeenCalled();
    expect(getDatabase).toHaveBeenCalled();
  });
  
  test('Form validation works when fields are empty', () => {
    // Import register code
    const { handleRegister } = require('./registerNode');
    
    // Call the handler with empty fields
    handleRegister(event);
    
    expect(event.preventDefault).toHaveBeenCalled();
    expect(document.getElementById('message').innerText).toBe('❌ Please fill in all required fields!');
    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
  });
  
  test('Registration successful with valid data', async () => {
    // Spy on console.error to prevent output in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // Mock successful registration
    createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'test-uid-123' }
    });
    set.mockResolvedValue(undefined);
    
    // Setup form values
    document.getElementById('username').value = 'testuser';
    document.getElementById('email').value = 'test@example.com';
    document.getElementById('password').value = 'Password123!';
    
    // Import register code
    const { handleRegister } = require('./registerNode');
    
    // Call the handler
    await handleRegister(event);
    
    expect(event.preventDefault).toHaveBeenCalled();
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'Password123!'
    );
    
    expect(hashPassword).toHaveBeenCalledWith('Password123!');
    
    expect(set).toHaveBeenCalledWith(
      expect.anything(), // We only care that some ref was passed, not what exactly it was
      {
        username: 'testuser',
        email: 'test@example.com',
        uid: 'test-uid-123'
      }
    );
    
    expect(document.getElementById('message').innerText).toBe('✅ Registration successful!');
    expect(document.getElementById('username').value).toBe('');
    expect(document.getElementById('email').value).toBe('');
    // Restore console functions
    console.log.mockRestore();
    console.error.mockRestore();
  });
  
  test('Registration handles Firebase errors', async () => {
    // Spy on console.error to prevent output in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock Firebase error
    createUserWithEmailAndPassword.mockRejectedValue({
      message: 'Email already in use'
    });
    
    // Setup form values
    document.getElementById('username').value = 'testuser';
    document.getElementById('email').value = 'test@example.com';
    document.getElementById('password').value = 'Password123!';
    
    // Import register code
    const { handleRegister } = require('./registerNode');
    
    // Call the handler
    await handleRegister(event);
    
    expect(event.preventDefault).toHaveBeenCalled();
    expect(document.getElementById('message').innerText).toBe('❌ Registration failed：Email already in use');
    
    // Restore console error
    console.error.mockRestore();
  });
});
