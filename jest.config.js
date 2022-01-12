module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "testMatch": [
    "**/?(*.).test.+(ts|js)",
    "**/__tests__/**/*.+(ts|js)",
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
}
