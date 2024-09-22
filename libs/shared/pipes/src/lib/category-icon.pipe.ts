import { inject, Pipe, PipeTransform } from '@angular/core';
import { Category, getCategoryIcon } from '@bk/categories';
import { ENV } from '@bk/util';

@Pipe({
  name: 'categoryIcon',
  standalone: true
})
export class CategoryIconPipe implements PipeTransform {
  private env = inject(ENV);

  transform(categoryId: number, categories: Category[]): string {
    const _iconName = getCategoryIcon(categories, categoryId);
    return `${this.env.app.imgixBaseUrl}/logo/ionic/${_iconName}.svg`;
  }
}