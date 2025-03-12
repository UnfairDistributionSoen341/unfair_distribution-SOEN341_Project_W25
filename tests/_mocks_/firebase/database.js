// Mocked firebase/database module
module.exports = {
  getDatabase: jest.fn(() => ({})),
  ref: jest.fn(() => ({})),
  set: jest.fn(() => Promise.resolve())
};
