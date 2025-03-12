// tests/setupTests.js
// This file runs before each test file

// Mock Firebase globally
global.initializeApp = jest.fn(() => ({}));
global.getAuth = jest.fn(() => ({}));
global.createUserWithEmailAndPassword = jest.fn();
global.getDatabase = jest.fn(() => ({}));
global.ref = jest.fn();
global.set = jest.fn(() => Promise.resolve());

// Silence console errors in tests (they're expected in some error test cases)
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  // Restore console.error after each test
  if (console.error.mockRestore) {
    console.error.mockRestore();
  }
});
