import { inject, Pipe, PipeTransform } from '@angular/core';
import { ENV } from '@bk/util';

@Pipe({
  name: 'fileTypeIcon',
  standalone: true
})
export class FileTypeIconPipe implements PipeTransform {
  private env = inject(ENV);

  transform(fileTypeIcon: string): string {
    return `${this.env.app.imgixBaseUrl}/logo/filetypes/${fileTypeIcon}.svg`;
  }
}
