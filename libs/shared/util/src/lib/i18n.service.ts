import { Injectable, inject } from "@angular/core";
import { HashMap, TranslocoService, getBrowserLang } from "@jsverse/transloco";
import { Observable, of } from "rxjs";
import { selectLanguage } from "./i18n.util";
import { ConfigService } from "./config/config.service";

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private translocoService = inject(TranslocoService);
  private configService = inject(ConfigService);

  public getBrowserLang(): string | undefined {
    return getBrowserLang();
  }

  public setActiveLang(language: string) {
    const _selectedLanguage = selectLanguage(this.configService.getAvailableLanguages(), this.configService.getConfigString('i18n_default_language'), language);
    this.translocoService.setActiveLang(_selectedLanguage);
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

