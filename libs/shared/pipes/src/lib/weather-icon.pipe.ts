import { inject, Pipe, PipeTransform } from '@angular/core';
import { WeatherConditions, getCategoryIcon } from '@bk/categories';
import { ENV } from '@bk/util';

@Pipe({
  name: 'weatherIcon',
  standalone: true
})
export class WeatherIconPipe implements PipeTransform {
  private env = inject(ENV);

  transform(weatherCondition: number): string {
    const _iconName = getCategoryIcon(WeatherConditions, weatherCondition);
    return `${this.env.app.imgixBaseUrl}/logo/weather/${_iconName}.svg`;
    }
}
