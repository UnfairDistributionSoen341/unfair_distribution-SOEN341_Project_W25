// Mocked firebase/database module
module.exports = {
  getDatabase: jest.fn(() => ({})),
  ref: jest.fn(() => ({})),
  set: jest.fn(() => Promise.resolve()),
  child: jest.fn(() => ({})),
  get: jest.fn(() => Promise.resolve({ exists: () => true, val: () => ({}) }))
};
