import { inject, Pipe, PipeTransform } from '@angular/core';
import { AddressChannels, getCategoryIcon } from '@bk/categories';
import { ENV } from '@bk/util';

@Pipe({
  name: 'channelIcon',
  standalone: true
})
export class ChannelIconPipe implements PipeTransform {
  private env = inject(ENV);


  transform(channelId: number): string {
    const _iconName = getCategoryIcon(AddressChannels, channelId);
    return `${this.env.app.imgixBaseUrl}/logo/ionic/${_iconName}.svg`;
  }
}
