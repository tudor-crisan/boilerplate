import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([

    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "no-relative-import-paths": noRelativeImportPaths,
      "unused-imports": unusedImports,
    },
    rules: {
      '@next/next/no-head-element': 'off',
      '@next/next/no-img-element': 'off',
      'react-hooks/set-state-in-effect': 'off',
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            [
              // All imports in one group to avoid newlines.
              // Components and internal @/ prefix come first (alphabetically)
              "^@/components",
              "^@/",
              "^react",
              "^next",
              "^@?\\w",
              "^\\u0000",
              "^\\.\\.(?!/?$)",
              "^\\.\\./?$",
              "^\\./(?![^/]*components)(?!/?$)",
              "^\\./?$",
              "^.+\\.?(css)$"
            ],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "no-relative-import-paths/no-relative-import-paths": [
        "error",
        { "allowSameFolder": false, "rootDir": ".", "prefix": "@" }
      ],
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
      ],
    }
  }
]);

export default eslintConfig;
