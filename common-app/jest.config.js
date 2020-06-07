//  useful command line options: --detectOpenHandles --forceExit
module.exports = {
  // bail: 0,
  // testTimeout: 5000,
  collectCoverage: false,
  // collectCoverageFrom: [
  //   "**/*.{js,jsx}",
  //   "!**/node_modules/**"
  // ]
  // coverageReporters: ["json", "lcov", "text", "clover"],
  // coverageThreshold: {
  //   "global": {
  //     branches: 50,
  //     functions: 50,
  //     lines: 50,
  //     statements: 50
  //   },
  //   "./src/components/": {
  //     branches: 40,
  //     statements: 40
  //   },
  // },
  roots: ['../' + require('./appname') + '/tests'], // directories to match
  // roots: ['<rootDir>/tests'], // directories to match
  testEnvironment: 'node',
  // testPathIgnorePatterns: ["/node_modules/"],
  // testMatch: [ "**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)" ], // files to match
  // testRegex: (/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$,
  verbose: false
}
