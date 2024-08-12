// This is just a template environment file, because the production settings should not be checked into the public git repository.
// In order to make this work, do the following:
//       copy this file to environment.ts
//       copy this file to environment.prod.ts
//       fill in your own configuration settings
// `ng build` for production replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `../project.json`.
// Sensitive information should be stored in environment variables using the Firebase config.
// This information is accessible via ConfigService/Firebase Remote Config.
// General configuration (i.e. configuration that is not app-specific) can be stored in utils/constants.ts.
// App-specific configuration can be stored in this environment file.

export const environment = {
  firebase: {
    apiKey: 'YOUR_KEY',
    authDomain: 'YOUR_DOMAIN',
    databaseURL: 'YOUR_DATABASE_URL',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
    measurementId: 'YOUR_MEASUREMENT_ID'
  },
  production: false,
  useEmulators: false,
  minimumConfigFetchInterval: 3600000,
  remote_config_defaults: {
    "app_domain": "APP_DOMAIN",
    "app_name": "APP_NAME",
    "app_releaseDate": "APP_RELEASE_DATE",
    "app_version": "APP_VERSION",
    "cms_imgix_base_url": "CMS_IMGIX_BASE_URL",
    "cms_login_url": "/auth/login/bko",
    "cms_logo_url": "CMS_LOGO_URL",
    "cms_notfound_banner_url": "CMS_NOTFOUND_BANNER_URL",
    "cms_osilogo_url": "assets/img/osi_logo.png",
    "cms_password_reset_url": "/auth/pwdreset",
    "cms_root_url": "/public/welcome",
    "cms_thumbnail_width": 200,
    "cms_thumbnail_height": 300,
    "cms_welcome_banner_url": "CMS_WELCOME_BANNER_URL",
    "dba_email": "DBA_EMAIL",
    "dba_name": "DBA_NAME",
    "dba_version": "DBA_VERSION",
    "git_issue_url": "GIT_ISSUE_URL",
    "git_name": "GIT_NAME",
    "git_org": "GIT_ORG",
    "gmap_key": "GMAP_KEY",
    "i18n_available_langs": "[\"en\",\"de\",\"fr\",\"es\",\"it\"]",
    "i18n_default_language": "de",
    "i18n_fallback_language": "de",
    "i18n_folder_url": "assets/i18n/",
    "i18n_locale": "de-ch",
    "i18n_log_missing_keys": "true",
    "i18n_user_language": "de",
    "i18n_use_fallback_translation": "true",
    "operator_city": "OPERATOR_CITY",
    "operator_email": "OPERATOR_EMAIL",
    "operator_name": "OPERATOR_NAME",
    "operator_phone": "OPERATOR_PHONE",
    "operator_street": "OPERATOR_STREET",
    "operator_uid": "OPERATOR_UID",
    "operator_web": "OPERATOR_WEB",
    "operator_zipcode": "OPERATOR_ZIPCODE",
    "settings_avatar_usage": "3",
    "settings_gravatar_email": "",
    "settings_invoice_delivery": "1",
    "settings_max_year": 2050,
    "settings_min_year": 1850,
    "settings_name_display": "0",
    "settings_news_delivery": "2",
    "settings_person_sort_criteria": "1",
    "settings_show_archived_data": "false",
    "settings_show_debug_info": "false",
    "settings_show_test_data": "false",
    "settings_toast_length": "3000",
    "settings_use_faceid": "false",
    "settings_use_touchid": "false",
    "tenant_email": "TENANT_EMAIL",
    "tenant_id": "TENANT_ID",
    "tenant_latitude": "TENANT_LATITUDE",
    "tenant_longitude": "TENANT_LONGITUDE",
    "tenant_name": "TENANT_NAME",
    "tenant_org_key": "TENANT_ORG_KEY",
    "tenant_postal": "TENANT_POSTAL"
  }
}
