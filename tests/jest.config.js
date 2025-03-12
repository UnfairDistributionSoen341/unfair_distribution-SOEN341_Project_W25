// tests/jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    // Map imports from SignUpPage directory
    '../../Sprint1/SignUpPage/(.*)
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.js'],
  collectCoverage: true,
  coverageReporters: ['text', 'html'],
  coverageDirectory: 'coverage'
};
: '<rootDir>/Sprint1/SignUpPage/$1',
    // Mock Firebase modules
    '^firebase/app
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.js'],
  collectCoverage: true,
  coverageReporters: ['text', 'html'],
  coverageDirectory: 'coverage'
};
: '<rootDir>/__mocks__/firebase/app.js',
    '^firebase/auth
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.js'],
  collectCoverage: true,
  coverageReporters: ['text', 'html'],
  coverageDirectory: 'coverage'
};
: '<rootDir>/__mocks__/firebase/auth.js',
    '^firebase/database
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.js'],
  collectCoverage: true,
  coverageReporters: ['text', 'html'],
  coverageDirectory: 'coverage'
};
: '<rootDir>/__mocks__/firebase/database.js'
  },
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.js'],
  collectCoverage: true,
  coverageReporters: ['text', 'html'],
  coverageDirectory: 'coverage'
};
