import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'favoriteIcon',
  standalone: true
})
export class FavoriteIconPipe implements PipeTransform {

  transform(isFavorite: boolean): string {
      return isFavorite ? 'star' : 'star-outline';
  }
}