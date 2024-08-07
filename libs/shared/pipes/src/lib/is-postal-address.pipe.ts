import { Pipe, PipeTransform } from '@angular/core';
import { AddressChannel } from '@bk/categories';

@Pipe({
  name: 'isPostal',
  standalone: true
})
export class IsPostalAddressPipe implements PipeTransform {

  transform(addressCategory: number): boolean {
      return (addressCategory === AddressChannel.Postal);
  }
}
