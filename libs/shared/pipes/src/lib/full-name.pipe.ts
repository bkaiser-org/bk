import { Pipe, PipeTransform } from '@angular/core';
import { NameDisplay, getFullPersonName } from '@bk/util';

@Pipe({
  name: 'fullName',
  standalone: true
})
export class FullNamePipe implements PipeTransform {

  transform(name1: string, name2: string, nameDisplay = NameDisplay.FirstLast): string {
      return getFullPersonName(name1, name2, '', nameDisplay)
  }
}