import { Pipe, PipeTransform } from '@angular/core';
import { getBirthdayDiff } from '@bk/util';

@Pipe({
  name: 'inDays',
  standalone: true
})
export class InDaysPipe implements PipeTransform {

  transform(storeDate: string): string {
    return getBirthdayDiff(storeDate).toString();
  }
}