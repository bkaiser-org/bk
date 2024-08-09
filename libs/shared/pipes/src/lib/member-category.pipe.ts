import { Pipe, PipeTransform } from '@angular/core';
import { MemberTypes, OrgKey, ScsMemberTypes, getCategoryAbbreviation } from '@bk/categories';

@Pipe({
  name: 'memberCategory',
  standalone: true
})
export class MemberCategoryPipe implements PipeTransform {
  transform(categoryId: number, objectKey: string): string {
    const _categories = objectKey === OrgKey.SCS ? ScsMemberTypes : MemberTypes;
      return getCategoryAbbreviation(_categories, categoryId);
  }
}