import { Pipe, PipeTransform } from '@angular/core';
import { bkTranslate } from '@bk/util';
@Pipe({
  name: 'prefixName',
  standalone: true
})
export class PrefixNamePipe implements PipeTransform {
  transform(name: string, prefix: string | undefined): string {
    return prefixName(name, prefix);
  }
}

export function prefixName(name: string, prefix: string | undefined): string {
  return bkTranslate(!prefix ? name : prefix + '.' + name);
}