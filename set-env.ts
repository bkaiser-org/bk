import * as fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();    // load environment variables from .env file
const writeFile = fs.writeFile;
const targetPath = `./apps/${process.env['AUTH_TENANTID']}/src/environments/environment.ts`;

export const setEnv = () => {
// example to read version from package.json: import { version as appVersion } from '../../package.json';

// `environment.ts` file structure
  const envConfigFile = `
  import {BkEnvironment} from '@bk/util';

  export const environment: BkEnvironment = {
    production: false,
    useEmulators: false,
    firebase: {
      apiKey: '${process.env['FIREBASE_API_KEY']}',
      authDomain: '${process.env['FIREBASE_AUTH_DOMAIN']}',
      databaseUrl: '${process.env['FIREBASE_DATABASE_URL']}',
      projectId: '${process.env['FIREBASE_PROJECT_ID']}',
      storageBucket: '${process.env['FIREBASE_STORAGE_BUCKET']}',
      messagingSenderId: '${process.env['FIREBASE_MESSAGING_SENDER_ID']}',
      appId: '${process.env['FIREBASE_APP_ID']}',
      measurementId: '${process.env['FIREBASE_MEASUREMENT_ID']}',
      appcheckRecaptchaEnterpriseKey: '${process.env['FIREBASE_RECAPTCHA_KEY']}'
    },
    app: {
      domain: '${process.env['APP_DOMAIN']}',
      imgixBaseUrl: '${process.env['APP_IMGIX_BASE_URL']}',
      rootUrl: '/public/welcome',
      logoUrl: 'tenant/${process.env['AUTH_TENANTID']}/logo/logo_round.svg',
      welcomeBannerUrl: 'tenant/${process.env['AUTH_TENANTID']}/app/welcome.jpg',
      notfoundBannerUrl: 'tenant/${process.env['AUTH_TENANTID']}/app/not-found.jpg',
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
      tenantId: '${process.env['AUTH_TENANTID']}',
      loginUrl: '/auth/login',
      passwordResetUrl: '/auth/pwdreset',
    },
    thumbnail: {
      width: 200,
      height: 300
    },
    dpo: {
      email: '${process.env['DPO_EMAIL']}',
      name: '${process.env['DPO_NAME']}'
    },
    git: {
      repo: '${process.env['GIT_REPO']}',
      org: '${process.env['GIT_ORG']}',
      issueUrl: 'https://github.com/${process.env['GIT_ORG']}/${process.env['GIT_REPO']}/issues/new'
    },
    services: {
      gmapKey: '${process.env['SVC_GMAP_KEY']}'
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
      name: '${process.env['OP_NAME']}',
      street: '${process.env['OP_STREET']}',
      zipcode: '${process.env['OP_ZIP']}',
      city: '${process.env['OP_CITY']}',
      email: '${process.env['OP_EMAIL']}',
      web: '${process.env['OP_WEB']}'
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
      console.error(err);
      throw err;
    } else {
      console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
    }
  });
};

setEnv();
