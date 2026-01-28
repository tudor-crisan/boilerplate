module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.svg$": "<rootDir>/tests/mocks/svgMock.js",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest"],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(framer-motion|clsx|tailwind-merge|@auth|next-auth)/)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/__tests__/testUtils.js"],
};
