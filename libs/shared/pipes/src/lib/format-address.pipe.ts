import { Pipe, PipeTransform } from '@angular/core';
import { AddressChannel } from '@bk/categories';
import { IbanFormat, formatIban } from '@bk/util';

@Pipe({
  name: 'formatAddress',
  standalone: true
})
export class FormatAddressPipe implements PipeTransform {

  transform(value: string, address2: string, zipCode: string, city: string, addressCategory: number): string {
      let _address = value;
      if (addressCategory === AddressChannel.BankAccount) {
        _address = formatIban(value, IbanFormat.Friendly);
      } else if (addressCategory === AddressChannel.Postal) {
        if (address2 && address2.length > 0) {
            _address = _address + ', ' + address2;
        }
        _address = _address + ', ' + zipCode + ' ' + city;
      }
      return _address;
  }
}
