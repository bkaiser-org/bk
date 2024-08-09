import { Pipe, PipeTransform, inject } from '@angular/core';
import { ConfigService, getThumbnailUrl } from '@bk/util';

@Pipe({
  name: 'logo',
  standalone: true
})
export class LogoPipe implements PipeTransform {
  private configService = inject(ConfigService);

  transform(url: string): string {
    return getThumbnailUrl(url, 
      this.configService.getConfigNumber('cms_logo_width'), 
      this.configService.getConfigNumber('cms_logo_height'));
  }
}
