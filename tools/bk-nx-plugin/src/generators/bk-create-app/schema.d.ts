/**
 * Conventions:
 * - fb_ prefix for Firebase configuration (see Firebase dashboard)
 * - app_ prefix for Firebase app configuration (see Firebase dashboard)
 * - firebase project name = firebase project id = tenant name (lowercase) = app name
 * - firebase app nickname = tenant id (3-5 lowercase chars)
 * - authDomain = app_domain (e.g. brunokaiser.ch, could be [fb_project_id].firebaseapp.com)
 * - initially, you will be the admin, dpo (data protection officer) and operator (your are able to change this later)
 * - a user account is prepared with your email address and a random password, you may (re-)set your password in the webapp
 */
export interface BkCreateAppGeneratorSchema {
  tenant_id: string;
  fb_api_key: string;
  fb_project_id: string;
  fb_messaging_sender_id: string;
  fb_app_id: string;
  fb_measurement_id: string;
  fb_appcheck_key: string;

  app_domain: string;
  app_reldate: string;
  app_version: string;
  imgix_baseurl: string;
  git_org: string;
  git_repo: string;
  gmap_key: string;

  admin_first_name: string;
  admin_last_name: string;
  admin_phone: string;
  admin_email: string;
  admin_street: string;
  admin_zipcode: string;
  admin_city: string;
  admin_web_url: string;
  op_comany: string;
}