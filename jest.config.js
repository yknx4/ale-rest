module.exports = {
  verbose: true,
  bail: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.js",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!src/**/index.js",
    "!src/**/config/*.js",
  ],
  coverageDirectory: "../coverage",
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 80,
      lines: 50,
      statements: 70
    }
  },
  // notify: true,
  clearMocks: true,
  rootDir: "src",
  setupTestFrameworkScriptFile: "<rootDir>/../jest.setup.js"
};
