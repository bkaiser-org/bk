import { inject, Pipe, PipeTransform } from '@angular/core';
import { ENV, SortDirection } from '@bk/util';

@Pipe({
  name: 'sortDirection',
  standalone: true
})
export class SortDirectionPipe implements PipeTransform {
  private env = inject(ENV);

  transform(sortDirection: SortDirection | null): string {
      if (sortDirection === null) return '?';
      // prior isSortedPipe already checked for undefined

      const _iconName = sortDirection === SortDirection.Ascending ? 'arrow-up-outline' : 'arrow-down-outline';
      return `${this.env.app.imgixBaseUrl}/logo/ionic/${_iconName}.svg`;
  }
}