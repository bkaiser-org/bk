import { Pipe, PipeTransform, inject } from '@angular/core';
import { ENV, getCountryName } from '@bk/util';

@Pipe({
  name: 'countryName',
  standalone: true
})
export class CountryNamePipe implements PipeTransform {
  private env = inject(ENV);

  transform(countryCode: string): string {
      return getCountryName(countryCode, this.env.i18n.userLanguage);
  }
}
