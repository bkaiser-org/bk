import { HashMap, getBrowserLang, translate } from '@jsverse/transloco';
import { die } from './log.util';

export function bkTranslate(key: string | null | undefined, argument?: HashMap): string {
  if (!key || key.length === 0) return '';
  if (key.startsWith('@')) {
    if (argument) {
      return translate(key.substring(1), argument);
    } else {
      return translate(key.substring(1));
    }
  } else {
    return key;
  }
}

/**
 * Select the used language based on 1) user settings (configured lang), 2) browser language, 3) default language DEFAULT_LANG
 * @param configuredLang the language as set in the user profile settings.
 * @returns the selected language code (one of AVAILABLE_LANGS)
 */
export function selectLanguage(availableLanguages: string[], defaultLanguage: string, configuredLanguage?: string): string {
  const _browserLanguage = getBrowserLang() ?? die('i18n.util.getSystemLang(): ERROR: browser language can not be determined.');
  const _selectedLanguage = !configuredLanguage ? _browserLanguage : configuredLanguage;

  // if this language is not supported, choose the default language instead
  return (availableLanguages.indexOf(_selectedLanguage) < 0) ? defaultLanguage : _selectedLanguage;
}

export function getLabel(label: string): string {
    return bkTranslate(label);
}
