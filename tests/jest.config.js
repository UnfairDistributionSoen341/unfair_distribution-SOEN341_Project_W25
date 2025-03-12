// tests/jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    // Map imports from SignUpPage directory
    "../Sprint1/SignUpPage/(.*)": "<rootDir>/Sprint1/SignUpPage/$1",
    // Mock Firebase modules
    "firebase/app": "<rootDir>/__mocks__/firebase/app.js",
    "firebase/auth": "<rootDir>/__mocks__/firebase/auth.js",
    "firebase/database": "<rootDir>/__mocks__/firebase/database.js"
  },
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.js'],
  collectCoverage: true,
  coverageReporters: ['text', 'html'],
  coverageDirectory: 'coverage'
};
