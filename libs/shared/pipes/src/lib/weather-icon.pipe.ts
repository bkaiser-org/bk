import { Pipe, PipeTransform } from '@angular/core';
import { WeatherCondition, WeatherConditions, getCategoryIcon } from '@bk/categories';

@Pipe({
  name: 'weatherIcon',
  standalone: true
})
export class WeatherIconPipe implements PipeTransform {

  transform(weatherCondition: number): string {
      return getWeatherIconUrl(weatherCondition);
  }
}

export function getWeatherIconUrl(weatherCondition: WeatherCondition): string {
  const _weatherIconName = getCategoryIcon(WeatherConditions, weatherCondition);
  return 'assets/weather/' + _weatherIconName + '.svg';
}