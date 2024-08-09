import { Pipe, PipeTransform } from '@angular/core';
import { SortDirection } from '@bk/util';

@Pipe({
  name: 'sortDirection',
  standalone: true
})
export class SortDirectionPipe implements PipeTransform {

  transform(sortDirection: SortDirection | null): string {
      if (sortDirection === null) return '?';
      // prior isSortedPipe already checked for undefined
      return sortDirection === SortDirection.Ascending ? 'arrow-up-outline' : 'arrow-down-outline';
  }
}