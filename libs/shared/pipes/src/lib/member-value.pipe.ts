import { Pipe, PipeTransform } from '@angular/core';
import { ListType, MemberTypes, ScsMemberTypes, getCategoryAbbreviation } from '@bk/categories';
import { prettyFormatDate } from '@bk/util';

@Pipe({
  name: 'memberValue',
  standalone: true
})
export class MemberValuePipe implements PipeTransform {


  transform(validTo: string, subType: number, listType: number): string {
    switch(listType) {
      case ListType.MemberScsAlumni:
      case ListType.MemberScsExits:
      case ListType.MemberScsDeceased:
          return prettyFormatDate(validTo);
      case ListType.MemberSrvAll:
          return getCategoryAbbreviation(MemberTypes, subType);
      default: 
          return getCategoryAbbreviation(ScsMemberTypes, subType);
    }      
  }
}