import { inject, Pipe, PipeTransform } from '@angular/core';
import { bkTranslate } from '@bk/util';
import { AlbumService } from '../section/album/album.service';
@Pipe({
  name: 'pageTitle',
  standalone: true
})
export class PageTitlePipe implements PipeTransform {
  private albumService = inject(AlbumService);
  transform(pageName: string): string {
    if (!pageName) return 'Album';
    if (pageName.startsWith('album')) {
      return this.albumService.title() ?? 'Album';
    }
    return bkTranslate(pageName);
  }
}
