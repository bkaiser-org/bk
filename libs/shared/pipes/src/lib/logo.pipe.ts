import { Pipe, PipeTransform, inject } from '@angular/core';
import { ENV, getThumbnailUrl } from '@bk/util';

@Pipe({
  name: 'logo',
  standalone: true
})
export class LogoPipe implements PipeTransform {
  private env = inject(ENV);

  transform(url: string): string {
    return getThumbnailUrl(url, this.env.thumbnail.width, this.env.thumbnail.height);
  }
}
