import { InjectionToken } from "@angular/core";

export type RoleName = 'none' | 'anonymous' | 'registered' | 'privileged' | 'contentAdmin' | 'resourceAdmin' | 'memberAdmin' | 'eventAdmin' | 'treasurer' | 'admin'| 'public' ;

export interface BkEnvironment {
  production: boolean;
  useEmulators: boolean;
  firebase: {
    apiKey: string;
    authDomain: string;
    databaseUrl: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
    appcheckRecaptchaEnterpriseKey: string;
  },
  app: {
    domain: string;
    imgixBaseUrl: string;
    rootUrl: string;
    logoUrl: string;
    welcomeBannerUrl: string;
    notfoundBannerUrl: string;
    osiLogoUrl: string;
    showDateOfBirth: RoleName;
    showDateOfDeath: RoleName;
    showGender: RoleName;
    showTaxId: RoleName;
    showBexioId: RoleName;
    showTags: RoleName;
    showNotes: RoleName;
    showMemberships: RoleName;
    showOwnerships: RoleName;
    showComments: RoleName;
    showDocuments: RoleName;
  },
  auth: {
    tenantId: string;
    loginUrl: string;
    passwordResetUrl: string;
  },
  thumbnail: {
    width: number;
    height: number;
  },
  dpo: {
    email: string;
    name: string;
  },
  git: {
    repo: string;
    org: string;
    issueUrl: string;
  },
  services: {
    gmapKey: string;
  },
  i18n: {
    availableLangs: string;
    defaultLanguage: string;
    fallbackLanguage: string;
    folderUrl: string;
    locale: string;
    logMissingKeys: boolean;
    userLanguage: string;
    useFallbackTranslation: boolean;
  },
  operator: {
    name: string;
    street: string;
    zipcode: string;
    city: string;
    email: string;
    web: string;
  },
  settingsDefaults: {
    avatarUsage: number;
    gravatarEmail: string;
    invoiceDelivery: number;
    maxYear: number;
    minYear: number;
    nameDisplay: number;
    newsDelivery: number;
    personSortCriteria: number;
    showArchivedData: boolean;
    showDebugInfo: boolean;
    showTestData: boolean;
    toastLength: number;
    useFaceId: boolean;
    useTouchId: boolean;
  }
}

export const ENV = new InjectionToken<BkEnvironment>('environment');