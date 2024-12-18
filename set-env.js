import * as fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();    // load environment variables from .env file
const writeFile = fs.writeFile;
const envPath = `./apps/${process.env['NEXT_PUBLIC_AUTH_TENANTID']}/src/environments/environment.ts`;
const envProdPath = `./apps/${process.env['NEXT_PUBLIC_AUTH_TENANTID']}/src/environments/environment.prod.ts`;

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
  writeFile(envPath, envConfigFile, (err) => {
    if (err) {
      console.error('Angular environment.ts file could not be generated with writeFile().');
      console.error(err);
      throw err;
    } else {
      console.log(`Angular environment.ts file generated correctly at ${envPath} \n`);
    }
  });
};

// /apps/TENANT/src/environments/environment.prod.ts
export const setProdEnv = () => {
    const prodEnvConfigFile = `
    import {BkEnvironment} from '@bk/util';
  
    export const environment: BkEnvironment = {
      production: true,
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
    writeFile(envProdPath, prodEnvConfigFile, (err) => {
      if (err) {
        console.error('Angular environment.prod.ts file could not be generated with writeFile().');
        console.error(err);
        throw err;
      } else {
        console.log(`Angular environment.ts file generated correctly at ${envProdPath} \n`);
      }
    });
  };

setEnv();
setProdEnv();
