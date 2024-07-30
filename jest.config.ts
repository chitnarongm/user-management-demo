import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  watchPathIgnorePatterns: ["<rootDir>/node_modules"],
  resetMocks: true,
  restoreMocks: true,
  preset: "ts-jest",
  transform: {
    "\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
};

export default createJestConfig(config);
