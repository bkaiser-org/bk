import { Pipe, PipeTransform } from '@angular/core';
import { AddressChannels, getCategoryIcon } from '@bk/categories';

@Pipe({
  name: 'channelIcon',
  standalone: true
})
export class ChannelIconPipe implements PipeTransform {

  transform(channelId: number): string {
      return getCategoryIcon(AddressChannels, channelId);
  }
}
