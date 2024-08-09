import { Pipe, PipeTransform } from '@angular/core';
import { getLogoByExtension } from '@bk/util';

@Pipe({
  name: 'fileLogo',
  standalone: true
})
export class FileLogoPipe implements PipeTransform {

  transform(extension: string): string {
      return getLogoByExtension(extension);
  }
}