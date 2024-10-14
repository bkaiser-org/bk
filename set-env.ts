import * as fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();    // load environment variables from .env file
const writeFile = fs.writeFile;
const targetPath = `./apps/${process.env['NEXT_PUBLIC_AUTH_TENANTID']}/src/environments/environment.ts`;

export const setEnv = () => {
// example to read version from package.json: import { version as appVersion } from '../../package.json';

// `environment.ts` file structure
  const envConfigFile = `
  import {BkEnvironment} from '@bk/util';

  export const environment: BkEnvironment = {
    production: false,
    useEmulators: false,
    firebase: {
      apiKey: '${process.env['NEXT_PUBLIC_FIREBASE_API_KEY']}',
      authDomain: '${process.env['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN']}',
      databaseUrl: '${process.env['NEXT_PUBLIC_FIREBASE_DATABASE_URL']}',
      projectId: '${process.env['NEXT_PUBLIC_FIREBASE_PROJECT_ID']}',
      storageBucket: '${process.env['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET']}',
      messagingSenderId: '${process.env['NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID']}',
      appId: '${process.env['NEXT_PUBLIC_FIREBASE_APP_ID']}',
      measurementId: '${process.env['NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID']}',
      appcheckRecaptchaEnterpriseKey: '${process.env['NEXT_PUBLIC_FIREBASE_RECAPTCHA_KEY']}'
    },
    app: {
      domain: '${process.env['NEXT_PUBLIC_APP_DOMAIN']}',
      imgixBaseUrl: '${process.env['NEXT_PUBLIC_APP_IMGIX_BASE_URL']}',
      rootUrl: '/public/welcome',
      logoUrl: 'tenant/${process.env['NEXT_PUBLIC_AUTH_TENANTID']}/logo/logo_round.svg',
      welcomeBannerUrl: 'tenant/${process.env['NEXT_PUBLIC_AUTH_TENANTID']}/app/welcome.jpg',
      notfoundBannerUrl: 'tenant/${process.env['NEXT_PUBLIC_AUTH_TENANTID']}/app/not-found.jpg',
      osiLogoUrl: 'logo/general/osi.svg',
      showDateOfBirth: 'admin',
      showDateOfDeath: 'admin',
      showGender: 'admin',
      showTaxId: 'admin',
      showBexioId: 'admin',
      showTags: 'admin',
      showNotes: 'admin',
      showMemberships: 'admin',
      showOwnerships: 'admin',
      showComments: 'admin',
      showDocuments: 'admin'
    },
    auth: {
      tenantId: '${process.env['NEXT_PUBLIC_AUTH_TENANTID']}',
      loginUrl: '/auth/login',
      passwordResetUrl: '/auth/pwdreset',
    },
    thumbnail: {
      width: 200,
      height: 300
    },
    dpo: {
      email: '${process.env['NEXT_PUBLIC_DPO_EMAIL']}',
      name: '${process.env['NEXT_PUBLIC_DPO_NAME']}'
    },
    git: {
      repo: '${process.env['NEXT_PUBLIC_GIT_REPO']}',
      org: '${process.env['NEXT_PUBLIC_GIT_ORG']}',
      issueUrl: 'https://github.com/${process.env['NEXT_PUBLIC_GIT_ORG']}/${process.env['NEXT_PUBLIC_GIT_REPO']}/issues/new'
    },
    services: {
      gmapKey: '${process.env['NEXT_PUBLIC_SVC_GMAP_KEY']}'
    },
    i18n: {
      availableLangs: '["en","de","fr","es","it"]',
      defaultLanguage: 'de',
      fallbackLanguage: 'de',
      folderUrl: 'assets/i18n/',
      locale: 'de-ch',
      logMissingKeys: true,
      userLanguage: 'de',
      useFallbackTranslation: true
    },
    operator: {
      name: '${process.env['NEXT_PUBLIC_OP_NAME']}',
      street: '${process.env['NEXT_PUBLIC_OP_STREET']}',
      zipcode: '${process.env['NEXT_PUBLIC_OP_ZIP']}',
      city: '${process.env['NEXT_PUBLIC_OP_CITY']}',
      email: '${process.env['NEXT_PUBLIC_OP_EMAIL']}',
      web: '${process.env['NEXT_PUBLIC_OP_WEB']}'
    },
    settingsDefaults: {
      avatarUsage: 3,
      gravatarEmail: '',
      invoiceDelivery: 1,
      maxYear: 2050,
      minYear: 1850,
      nameDisplay: 0,
      newsDelivery: 2,
      personSortCriteria: 1,
      showArchivedData: false,
      showDebugInfo: false,
      showTestData: false,
      toastLength: 3000,
      useFaceId: false,
      useTouchId: false
    }
  };
`;
  writeFile(targetPath, envConfigFile, (err) => {
    if (err) {
      console.error('Angular environment.ts file could not be generated with writeFile().');
      console.error(err);
      throw err;
    } else {
      console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
    }
  });
};

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
  writeFile('./nx.json', nxJson, (err) => {
    if (err) {
      console.error('nx.json file could not be generated with writeFile().');
      console.error(err);
      throw err;
    } else {
      console.log(`nx.json file generated correctly at ./nx.json \n`);
    }
  });
};

setEnv();
writeNxJson();