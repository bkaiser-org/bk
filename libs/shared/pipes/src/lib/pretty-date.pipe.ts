import { Pipe, PipeTransform } from '@angular/core';
import { prettyFormatDate } from '@bk/util';

@Pipe({
  name: 'prettyDate',
  standalone: true
})
export class PrettyDatePipe implements PipeTransform {

  transform(storeDate: string | undefined, showYear = true): string {
    return  prettyFormatDate(storeDate, showYear);
  }
}
