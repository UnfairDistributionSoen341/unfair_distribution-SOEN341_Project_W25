// Mocked firebase/database module
module.exports = {
  getDatabase: jest.fn(() => ({})),
  ref: jest.fn(() => "mocked-ref"),
  set: jest.fn(() => Promise.resolve())
};
