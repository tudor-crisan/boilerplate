import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";

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
    },
    rules: {
      '@next/next/no-head-element': 'off',
      '@next/next/no-img-element': 'off',
      'react-hooks/set-state-in-effect': 'off',
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Packages `react` related packages come first.
            ["^react", "^@react"],
            // Side effect imports.
            ["^\\u0000"],
            // Components imports.
            ["^@/components", "^\\./components", "^\\.\\./components"],
            // Internal packages.
            ["^@/"],
            // Parent imports. Put `..` last.
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // Other relative imports. Put same-folder imports and `.` last.
            ["^\\./(?![^/]*components)(?!/?$)", "^\\./?$"],
            // Style imports.
            ["^.+\\.?(css)$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "no-relative-import-paths/no-relative-import-paths": [
        "error",
        { "allowSameFolder": false, "rootDir": ".", "prefix": "@" }
      ],
    }
  }
]);

export default eslintConfig;
