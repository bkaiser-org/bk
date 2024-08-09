import { Pipe, PipeTransform } from '@angular/core';
import { BaseModel } from '@bk/models';
import { getListItemColor } from '@bk/util';

@Pipe({
  name: 'itemColor',
  standalone: true
})
export class ItemColorPipe implements PipeTransform {

  transform(item: BaseModel): string {
      return getListItemColor(item.isTest, item.isArchived);
  }
}
