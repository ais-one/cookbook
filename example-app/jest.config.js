//  useful command line options: --detectOpenHandles --forceExit
const path = require('path')

module.exports = {
  // globals: { "APP_NAME": path.basename( path.dirname(__filename) ) },
  // bail: 0,
  // testTimeout: 5000,
  collectCoverage: false,
  // collectCoverageFrom: [ "**/*.{js,jsx}", "!**/node_modules/**" ]
  // coverageReporters: ["json", "lcov", "text", "clover"],
  // coverageThreshold: {
  //   "global": { branches: 50, functions: 50, lines: 50, statements: 50 },
  //   "./src/components/": { branches: 40, statements: 40 },
  // },
  roots: ['<rootDir>/tests'], // directories to match // root dir
  testEnvironment: 'node',
  setupFiles: [ path.join(process.cwd(), 'common-lib', 'setup.js') ],
  // testPathIgnorePatterns: ["/node_modules/"],
  // testMatch: [ "**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)" ], // files to match
  // testRegex: (/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$,
  verbose: false
}
