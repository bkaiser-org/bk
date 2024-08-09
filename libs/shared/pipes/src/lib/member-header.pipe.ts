import { Pipe, PipeTransform } from '@angular/core';
import { ListType } from '@bk/categories';

@Pipe({
  name: 'memberHeader',
  standalone: true
})
export class MemberHeaderPipe implements PipeTransform {

  transform(listType: ListType): string {
    return listType === ListType.MemberScsDeceased ? '@membership.list.header.dateOfDeath' : '@membership.list.header.category';
  }
}