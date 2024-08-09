import { Pipe, PipeTransform, inject } from '@angular/core';
import { ConfigService, getCountryName } from '@bk/util';

@Pipe({
  name: 'countryName',
  standalone: true
})
export class CountryNamePipe implements PipeTransform {
  private configService = inject(ConfigService);

  transform(countryCode: string): string {
      return getCountryName(countryCode, this.configService.getConfigString('i18n_user_language'));
  }
}
