import { addIndexElement } from "@bk/base";
import { AddressChannel, AddressUsage } from "@bk/categories";
import { AddressModel, BaseModel, isAddress } from "@bk/models";
import { bkTranslate, copyToClipboard, getCountryName, showToast, warn } from "@bk/util";
import { Browser } from "@capacitor/browser";
import { ToastController } from "@ionic/angular";

/* ---------------------- Index operations ------------------------- */
export function getAddressIndex(address: BaseModel): string {
    let _index = '';
    if (isAddress(address)) {
      _index = (address.category === AddressChannel.Postal) ?
        addIndexElement(_index, 'n', `${address.name}, ${address.countryCode} ${address.zipCode} ${address.city}`) :
        addIndexElement(_index, 'n', address.name);
    }
    return _index;
}

/**
 * Returns a string explaining the structure of the index.
 * This can be used in info boxes on the GUI.
 */
export function getAddressIndexInfo(): string {
    return 'n:addressValue';
}

/***************************  helpers *************************** */
export function getAddressModalTitle(addressKey: string | undefined): string {
  const _operation = !addressKey ? 'create' : 'update';
  return `@subject.address.operation.${_operation}.label`;
}

export function getStringifiedPostalAddress(address: AddressModel, lang: string): string | undefined {
    if (!address || address.category  !== AddressChannel.Postal) return undefined;
    const _countryName = getCountryName(address.countryCode, lang);
    return !_countryName ?
      `${address.name}, ${address.zipCode} ${address.city}` :
      `${address.name}, ${address.zipCode} ${address.city}, ${_countryName}`;
}

/**
 * Convenience method for migration and import. Creates an arbitrary address.
 */
export function createAddress(
    addressUsage: AddressUsage,
    addressChannel: AddressChannel,
    value: string,
    isFavorite = false,
    isValidated = false,
    isCc = false,
    isTest = false,
    isArchived = false
): AddressModel {
    const _address = new AddressModel();
    _address.addressUsage = addressUsage;
    _address.category = addressChannel as number;
    _address.name = value;
    _address.isFavorite = isFavorite;
    _address.isCc = isCc;
    _address.isTest = isTest;
    _address.isArchived = isArchived;
    _address.isValidated = isValidated;
    return _address;
}

/**
 * Create a favorite email address.
 * @param addressUsage the usage type of the email address (e.g. home, work)
 * @param addressValue the email address
 * @returns the AddressModel of the email address
 */
export function createFavoriteEmailAddress(
    addressUsage: AddressUsage,
    addressValue: string): AddressModel {
    return createAddress(addressUsage, AddressChannel.Email, addressValue, true);
}

/**
 * Create a favorite phone address.
 * @param addressUsage the usage type of the phone number (e.g. home, work, mobile)
 * @param addressValue the phone number
 * @returns the AddressModel of the phone number
 */
export function createFavoritePhoneAddress(
  addressUsage: AddressUsage,
  addressValue: string): AddressModel {
    return createAddress(addressUsage, AddressChannel.Phone, addressValue, true);
}

/**
 * Create a favorite web address (URL)
 * @param addressUsage the usage type of the web address (e.g. home, work)
 * @param addressValue the URL of the web address
 * @returns the AddressModel of the web address
 */
export function createFavoriteWebAddress(
  addressUsage: AddressUsage,
  addressValue: string): AddressModel {
    return createAddress(addressUsage, AddressChannel.Web, addressValue, true);
}

/**
 * Create a postal address.
 * @param addressUsage 
 * @param street 
 * @param addressValue2 
 * @param zipCode 
 * @param city 
 * @param countryCode 
 * @param isFavorite 
 * @param isValidated 
 * @param isCc 
 * @param isTest 
 * @param isArchived 
 * @returns the AddressModel of the postal address
 */
export function createPostalAddress(
    addressUsage: AddressUsage,
    street: string,
    addressValue2: string,
    zipCode: string,
    city: string,
    countryCode: string,
    isFavorite = false,
    isValidated = false,
    isCc = false,
    isTest = false,
    isArchived = false
): AddressModel {
    const _address = new AddressModel();
    _address.addressUsage = addressUsage;
    _address.category = AddressChannel.Postal as number;
    _address.name = street;
    _address.addressValue2 = addressValue2;
    _address.zipCode = zipCode;
    _address.city = city;
    _address.countryCode = countryCode;
    _address.isFavorite = isFavorite;
    _address.isCc = isCc;
    _address.isTest = isTest;
    _address.isArchived = isArchived;
    _address.isValidated = isValidated;
    return _address;
}

/**
 * Create a favorite postal address.
 * @param addressUsage the usage type of the address (e.g. home, work, mobile)
 * @param street, the street name 
 * @param zipCode, a zip code, 8712 by default
 * @param city, a city name, Stäfa by default
 * @param countryCode a country code, CH by default
 * @returns the address model of the favorite postal address
 */
export function createFavoritePostalAddress(addressUsage: AddressUsage, street: string, zipCode = '8712', city = 'Stäfa', countryCode = 'CH'): AddressModel {
    return createPostalAddress(addressUsage, street, '', zipCode, city, countryCode, true);
}

/**
 * Use an address based on its channel type, e.g. browse to a URL or call a phone number.
 * @param address 
 * @returns 
 */
  export async function useAddress(address: AddressModel): Promise<void> {
    switch(address.category ) {
        case AddressChannel.Email:  return browseUrl(`mailto:${address.name}`, '');
        case AddressChannel.Phone:  return browseUrl(`tel:${address.name}`, '');
        case AddressChannel.Postal: 
          warn('AddressService.useAddress: useAddress for postal addresses should not be called here.');
          break;
        case AddressChannel.Web: return browseUrl(address.name, 'https://');
        case AddressChannel.Twitter: return browseUrl(address.name, 'https://twitter.com/');
        case AddressChannel.Xing: return browseUrl(address.name, 'https://www.xing.com/profile/');
        case AddressChannel.Facebook: return browseUrl(address.name, 'https://www.facebook.com/');
        case AddressChannel.Linkedin: return browseUrl(address.name, 'https://www.linkedin.com/in/');
        case AddressChannel.Instagram: return browseUrl(address.name, 'https://www.instagram.com/');
        default: warn('AddressService.useAddress: unsupported address channel ' + address.category + ' for address ' + address.name + '/' + address.bkey);
      }
      return Promise.resolve();
  }

  /**
   * Copy an address to the clipboard.
   * @param toastController used to show a confirmation message
   * @param address the address to copy
   */
  export async function copyAddress(toastController: ToastController, toastLength: number, address: AddressModel, lang: string): Promise<void> {
    if (address.category === AddressChannel.Postal) {
      await copyToClipboard(getStringifiedPostalAddress(address, lang));
    } else {
      await copyToClipboard(address.name);
    }
    await showToast(toastController, bkTranslate('@subject.address.operation.copy.conf'), toastLength);
  }

  /**
   * Browse to a URL.
   * @param url 
   * @param prefix a URL prefix that is defined by the channel type (e.g. https://twitter.com for type Twitter)
   */
  export async function browseUrl(url: string, prefix: string): Promise<void> {
    return Browser.open({ url: prefix + url });
  }

  export function stringifyAddress(address: AddressModel): string {
    if (!address) return '';
    if (address.category === AddressChannel.Postal) {
    return `${address.name}, ${address.zipCode} ${address.city}`;
    } else {
      return address.name;
    }
  }