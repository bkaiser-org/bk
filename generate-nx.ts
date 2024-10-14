import * as fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();    // load environment variables from .env file
const writeFile = fs.writeFile;
const nxJsonPath = './nx.json';

export const writeNxJson = () => {
    const nxJson = `
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": [
      "default",
      "!{projectRoot}/.eslintrc.json",
      "!{projectRoot}/eslint.config.js",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json",
      "!{projectRoot}/jest.config.[jt]s",
      "!{projectRoot}/src/test-setup.[jt]s",
      "!{projectRoot}/test-setup.[jt]s",
      "!{projectRoot}/cypress/**/*",
      "!{projectRoot}/**/*.cy.[jt]s?(x)",
      "!{projectRoot}/cypress.config.[jt]s"
    ],
    "sharedGlobals": ["{workspaceRoot}/.github/workflows/ci.yml"]
  },
  "targetDefaults": {
    "@angular-devkit/build-angular:application": {
      "cache": true,
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"]
    },
    "@nx/eslint:lint": {
      "cache": true,
      "inputs": [
        "default",
        "{workspaceRoot}/.eslintrc.json",
        "{workspaceRoot}/.eslintignore",
        "{workspaceRoot}/eslint.config.js"
      ]
    },
    "@nx/jest:jest": {
      "cache": true,
      "inputs": ["default", "^production", "{workspaceRoot}/jest.preset.js"],
      "options": {
        "passWithNoTests": true
      },
      "configurations": {
        "ci": {
          "ci": true,
          "codeCoverage": true
        }
      }
    },
    "@nx/js:tsc": {
      "cache": true,
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"]
    }
  },
  "plugins": [
    {
      "plugin": "@nx/cypress/plugin",
      "options": {
        "targetName": "e2e",
        "openTargetName": "open-cypress",
        "componentTestingTargetName": "component-test",
        "ciTargetName": "e2e-ci"
      }
    },
    {
      "plugin": "@nx/eslint/plugin",
      "options": {
        "targetName": "lint"
      }
    }
  ],
  "generators": {
    "@nx/angular:application": {
      "e2eTestRunner": "cypress",
      "linter": "eslint",
      "style": "scss",
      "unitTestRunner": "jest"
    }
  },
  "nxCloudAccessToken": "${process.env['NEXT_PUBLIC_NX_CLOUD_ACCESS_TOKEN']}"
}
  `;
  writeFile(nxJsonPath, nxJson, (err) => {
    if (err) {
      console.error('nx.json file could not be generated with writeFile().');
      console.error(err);
      throw err;
    } else {
      console.log(`nx.json file generated correctly at ${nxJsonPath} and cloud access token <${process.env['NEXT_PUBLIC_NX_CLOUD_ACCESS_TOKEN']}>\n`);
    }
  });
};

writeNxJson();