
/**
 * Here, we define defaults that are used for consistency reasons across the app.
 * Only define defaults that are independent of any app-specific configuration.
 * App-specific configuration data is defined in the environment files or in the Firebase config.
 * The defaults are defined as constants, so that they can be used in the templates.
 * Any dependencies to other modules must be avoided. Otherwise, it could lead to circular dependencies.
 *
 */

//-----------------------------------------------
// ports
//-----------------------------------------------
export const AUTH_EMULATOR_PORT = 9099;
export const STORAGE_EMULATOR_PORT = 9199;
// const FUNCTIONS_EMULATOR_PORT = 5001;
// const PUBSUB_EMULATOR_PORT = 8085;
// const EMULATOR_UI_PORT = 4000;

//-----------------------------------------------
// form field patterns (for validators)
//-----------------------------------------------
export const SSN_PATTERN = '756[0-9]*';
export const TAX_ID_PATTERN = '^CHE[0-9]*';
export const IBAN_PATTERN = '^CH[0-9]*';
export const NAME_PATTERN = '[a-zA-Z öüäéâàèç-]*';
export const NAME_NUMBER_PATTERN = '[a-zA-Z0-9 öüäéâàèç-]*';
export const ALL_CHARS_PATTERN = '[!-~]*';
// keep the escapes, because we need it later within the regex)
// eslint-disable-next-line no-useless-escape
export const SPECIAL_CHARS_PATTERN = '[\p{P}\p{S}]'; // https://stackoverflow.com/questions/18057962/regex-pattern-including-all-special-characters
export const INTEGER_PATTERN = '[0-9]*';
export const PHONE_PATTERN = '[- +()0-9]{6,}'


// local images
export const DEFAULT_AVATAR_URL = 'assets/img/logo_square.png';
export const DEFAULT_AVATAR_ROUND_URL = 'assets/img/logo_round.png';
export const DEFAULT_SHOW_FOOTER = false;

//-----------------------------------------------
// dates
//-----------------------------------------------
export const END_FUTURE_DATE = 99991231;    // used for searches
export const END_FUTURE_DATE_STR = '99991231';
export const START_PAST_DATE = 19000101;    // used for searches
export const START_PAST_DATE_STR = '19000101';

/**-------------------------------------------------------------------------
 * Styling
---------------------------------------------------------------------------*/
export const MODAL_STYLE = '.modalContent { background: #fff; border-radius: 10px; @media only screen and (min-width: 768px)  {  width: 50%; display: block; margin-left: auto; margin-right: auto; }}';

/**-------------------------------------------------------------------------
 * The length of a form field.
---------------------------------------------------------------------------*/
export const NAME_LENGTH = 50;
export const SHORT_NAME_LENGTH = 30;
export const LONG_NAME_LENGTH = 100;
export const ABBREVIATION_LENGTH = 5;
export const WORD_LENGTH = 20;
export const STREET_LENGTH = 50;
export const CITY_LENGTH = 30;
export const ZIP_LENGTH = 4;
export const INT_LENGTH = 6;
export const NUMBER_LENGTH = 10;
export const SHORT_NUMBER_LENGTH = 4;
export const COUNTRY_LENGTH = 2;
export const DESCRIPTION_LENGTH = 5000;
export const COMMENT_LENGTH = 500;
export const IBAN_LENGTH = 21;
export const TAX_ID_LENGTH = 12;
export const SSN_LENGTH = 13;
export const DATE_LENGTH = 10;
export const STORE_DATE_LENGTH = 8;
export const STORE_DATETIME_LENGTH = 14;
export const LOCKER_LENGTH = 3;
export const KEY_LENGTH = 5;
export const URL_LENGTH = 1000;

// misc form field values
export const DESCRIPTION_ROWS = 5;
export const COMMENT_ROWS = 2;
export const DEBOUNCE_TIME = 500;

/**-------------------------------------------------------------------------
 * Prices
 * tbd: https://github.com/bkaiserGmbh/bk4/issues/128
 * this app-specific information should be removed from here
---------------------------------------------------------------------------*/
export const SCS_A1_FEE = 600;
export const SCS_A2_FEE = 300;
export const SCS_A3_FEE = 200;
export const SCS_JUNIOR_FEE = 300;
export const SCS_FREE_FEE = 200;
export const SCS_HONORARY_FEE = 0;
export const SCS_CANDIDATE_FEE = 600
export const SCS_PASSIVE_FEE = 75;
export const SCS_ENTRY_FEE = 750;

export const SCS_LOCKER_FEE = 20;
export const SCS_KEY_DEPOSIT = 50;
export const SCS_SKIFF_INSURANCE = 50;
export const SCS_SKIFF_STORAGE = 600;

export const SRV_ACTIVE_FEE = 75;
export const SRV_LICENSE_FEE = 50;
export const SRV_JUNIOR_FEE = 0;
export const SRV_DOUBLE_FEE = 0;

/**-------------------------------------------------------------------------
 * Input Mode is a hint to the browser for which keyboard to display.
---------------------------------------------------------------------------*/
export type InputMode = 'decimal' | 'email' | 'numeric' | 'search' | 'tel' | 'text' | 'url';

/**-------------------------------------------------------------------------
 * Input Type defines the type of control to display.
---------------------------------------------------------------------------*/
export type InputType = 'date' | 'datetime-local' | 'email' | 'month' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week';

/**-------------------------------------------------------------------------
 * AutoComplete allows to apply automated assitance in filling out form field values
 * as well as guide the browser as to the type of information expected in a given field.
 *  * see: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
---------------------------------------------------------------------------*/
export type AutoComplete = 'name' | 'email' | 'tel' | 'url' | 'off' | 'given-name'
| 'family-name' | 'new-password' | 'organization' | 'street-address' | 'country'
| 'country-name' | 'postal-code' | 'bday' | 'address-level2'; 

