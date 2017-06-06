module.exports = {
  verbose: true,
  bail: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.js", "!**/node_modules/**", "!**/vendor/**"],
  coverageDirectory: '../coverage',
  coverageThreshold: {
      global: {
        branches: 70,
        functions: 80,
        lines: 50,
        statements: 50
      }
    },
  notify: true,
  clearMocks: true,
  rootDir: "src",
};
