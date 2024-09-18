import { Injectable, inject } from "@angular/core";
import { HashMap, TranslocoService, getBrowserLang } from "@jsverse/transloco";
import { Observable, of } from "rxjs";
import { selectLanguage } from "./i18n.util";
import { ENV } from "./config/env";

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private translocoService = inject(TranslocoService);
  private env = inject(ENV);

  public getBrowserLang(): string | undefined {
    return getBrowserLang();
  }

  public setActiveLang(language: string) {
    const _selectedLanguage = selectLanguage(this.getAvailableLanguages(), this.env.i18n.defaultLanguage, language);
    this.translocoService.setActiveLang(_selectedLanguage);
  }

  private getAvailableLanguages(): string[] {
    return JSON.parse(this.env.i18n.availableLangs) as string[];
  }

  // tbd: checkSupportedLang(lang: string): boolean 

  /**
   * Translate a key into the current language.
   * We need to use selectTranslate() instead of translate() in order to make sure that the translations were loaded.
   * @param key 
   * @param argument 
   * @returns 
   */
  public translate(key: string | null | undefined, argument?: HashMap): Observable<string> {
    if (!key || key.length === 0) return of('');
    if (key.startsWith('@')) {
      if (argument) {
        return this.translocoService.selectTranslate(key.substring(1), argument);
      } else {
        return this.translocoService.selectTranslate(key.substring(1));
      }
    } else {
      return of(key);
    }
  }
}

