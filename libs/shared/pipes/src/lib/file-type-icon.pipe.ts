import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileTypeIcon',
  standalone: true
})
export class FileTypeIconPipe implements PipeTransform {

  transform(fileTypeIcon: string): string {
      return `assets/filetypes/${fileTypeIcon}.svg`;
  }
}