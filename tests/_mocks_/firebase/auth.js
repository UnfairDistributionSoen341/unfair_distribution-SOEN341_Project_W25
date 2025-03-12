// Mocked firebase/auth module
module.exports = {
  getAuth: jest.fn(() => ({})),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({
    user: { uid: 'mock-uid-12345' }
  }))
};
