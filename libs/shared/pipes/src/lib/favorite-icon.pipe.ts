import { inject, Pipe, PipeTransform } from '@angular/core';
import { ENV } from '@bk/util';

@Pipe({
  name: 'favoriteIcon',
  standalone: true
})
export class FavoriteIconPipe implements PipeTransform {
  private env = inject(ENV);

  transform(isFavorite: boolean): string {
    const _iconName = isFavorite ? 'star' : 'star-outline';
    return `${this.env.app.imgixBaseUrl}/logo/ionic/${_iconName}.svg`;
  }
}