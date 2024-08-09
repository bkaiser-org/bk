import { AddressChannel, AddressUsage } from '@bk/categories'
import { AddressFormModel, AddressModel } from '@bk/models'
import { IbanFormat, die, formatIban, replaceEndingSlash, replaceSubstring } from '@bk/util';

export function newAddressFormModel(): AddressFormModel {
  return {
    addressChannel: AddressChannel.Postal,
    addressChannelLabel: '',
    addressUsage: AddressUsage.Home,
    addressUsageLabel: '',
    addressValue: '',
    phone: '',
    email: '',
    street: '',
    addressValue2: '',
    zipCode: '',
    city: '',
    countryCode: 'CH',
    iban: '',
    isFavorite: false,
    isCc: false,
    isValidated: false,
    url: '',
    notes: '',
    tags: '',
    parentKey: ''
  }

}

export function convertAddressToForm(address: AddressModel | undefined): AddressFormModel {
  if (!address) return newAddressFormModel();
  return {
    bkey: address.bkey,
    addressChannel: address.category,
    addressChannelLabel: address.addressChannelLabel,
    addressUsage: address.addressUsage,
    addressUsageLabel: address.addressUsageLabel,
    addressValue: address.name,
    phone: address.name,
    email: address.name,
    street: address.name,
    addressValue2: address.addressValue2,
    zipCode: address.zipCode,
    city: address.city,
    countryCode: address.countryCode,
    iban: address.category === AddressChannel.BankAccount ? formatIban(address.name, IbanFormat.Friendly) : '',
    isFavorite: address.isFavorite,
    isCc: address.isCc,
    isValidated: address.isValidated,
    url: address.url,
    notes: address.description,
    tags: address.tags,
    parentKey: address.parentKey
  }
}

export function convertFormToAddress(vm: AddressFormModel): AddressModel {
  if (vm.addressChannel === undefined) die('AddressFormUtil.convertFormToAddress: vm.addressChannel is mandatory');
  if (vm.addressUsage === undefined) die('AddressFormUtil.convertFormToAddress: vm.addressUsage is mandatory');

  const _address = new AddressModel();
  _address.bkey = vm.bkey ?? '';
  _address.category = vm.addressChannel;
  _address.addressChannelLabel = vm.addressChannelLabel ?? '';
  _address.addressUsage = vm.addressUsage;
  _address.addressUsageLabel = vm.addressUsageLabel ?? '';
  _address.name = getAddressValueByChannel(vm);
  _address.addressValue2 = vm.addressValue2 ?? '';
  _address.zipCode = vm.zipCode ?? '';
  _address.city = vm.city ?? '';
  _address.countryCode = vm.countryCode ?? '';
  _address.isFavorite = vm.isFavorite ?? false;
  _address.isCc = vm.isCc ?? false;
  _address.isValidated = vm.isValidated ?? false;
  _address.url = vm.url ?? '';
  _address.description = vm.notes ?? '';
  _address.tags = vm.tags ?? '';
  _address.parentKey = vm.parentKey ?? '';
  return _address;
}

export function getAddressValueByChannel(vm: AddressFormModel): string {
  if (vm.addressChannel === undefined) die('AddressFormUtil.convertFormToAddress: vm.addressChannel is mandatory');

  // make some corrections of user input
  // street:  replace str. with strasse
  if (vm.street) {
    vm.street = replaceSubstring(vm.street ?? '', 'str.', 'strasse');
  }
  if (vm.addressValue) {
    vm.addressValue = replaceSubstring(vm.addressValue, 'http://', '');
    vm.addressValue = replaceSubstring(vm.addressValue, 'https://', '');
    vm.addressValue = replaceSubstring(vm.addressValue, 'twitter.com/', '');
    vm.addressValue = replaceSubstring(vm.addressValue, 'www.xing.com/profile/', '');
    vm.addressValue = replaceSubstring(vm.addressValue, 'www.facebook.com/', '');
    vm.addressValue = replaceSubstring(vm.addressValue, 'www.linkedin.com/in/', '');
    vm.addressValue = replaceSubstring(vm.addressValue, 'www.instagram.com/', '');
    vm.addressValue = replaceEndingSlash(vm.addressValue);
  }
  if (vm.phone) {
    vm.phone = replaceSubstring(vm.phone, 'tel:', '');
  }
  if (vm.email) {
    vm.email = replaceSubstring(vm.email, 'mailto:', '');
  }
  switch (vm.addressChannel) {
    case AddressChannel.Phone: return vm.phone ?? '';
    case AddressChannel.Email: return vm.email ?? '';
    case AddressChannel.Postal: return vm.street ?? '';
    case AddressChannel.BankAccount: return formatIban(vm.iban ?? '', IbanFormat.Electronic);
    default: return vm.addressValue ?? '';
  }
}


