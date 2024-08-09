import { Pipe, PipeTransform } from '@angular/core';
import { AddressUsage, AddressUsages, getCategoryLabel } from '@bk/categories';
import { bkTranslate } from '@bk/util';

// address.usage | addressUsageName:address.usageLabel
@Pipe({
  name: 'addressUsageName',
  standalone: true
})
export class AddressUsageNamePipe implements PipeTransform {

  transform(usage: number, label: string): string {
    if (usage === AddressUsage.Custom) {
      if (label && label.length > 0) {
          return label;
      } else {
          return '';
      }
  }
  return bkTranslate(getCategoryLabel(AddressUsages, usage));
  }
}
