import { inject, Pipe, PipeTransform } from '@angular/core';
import { ENV } from '@bk/util';

@Pipe({
  name: 'svgIcon',
  standalone: true
})
export class SvgIconPipe implements PipeTransform {
  private env = inject(ENV);

  transform(iconName: string): string {
    return `${this.env.app.imgixBaseUrl}/logo/ionic/${iconName}.svg`;
      // return `/assets/icons/${iconName}.svg`;
  }
}
