module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss|sass|svg)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      { configFile: "./babel.jest.json" },
    ],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(framer-motion|clsx|tailwind-merge|@auth|next-auth|next)/)",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/testUtils.js",
    "tests/libs/utils.server.test.js",
    "tests/libs/email.test.js",
    "tests/libs/api.test.js",
    "tests/components/modules/VideoModule.test.js",
  ],
};
