/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.js'],
  transform: {
    '^.+\\.(ts|js)$': 'babel-jest'
  },
  collectCoverageFrom: [
    'api/**/*.js',
    'lib/**/*.js'
  ],
  coverageThreshold: {
    global: {
      lines: 70
    }
  }
}
