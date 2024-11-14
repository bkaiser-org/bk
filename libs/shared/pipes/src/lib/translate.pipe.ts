import { Pipe, PipeTransform, inject } from "@angular/core";
import { I18nService } from "@bk/util";
import { HashMap } from "@jsverse/transloco";
import { Observable } from "rxjs";

@Pipe({
  name: 'translate',
  standalone: true,
})
export class TranslatePipe implements PipeTransform {
  private readonly i18nService = inject(I18nService);

  transform(key: string | undefined | null, argument?: HashMap): Observable<string> {
    return this.i18nService.translate(key, argument);  
  }
}
