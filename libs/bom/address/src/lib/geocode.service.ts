import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AddressChannel } from '@bk/categories';
import { AddressModel } from '@bk/models';
import { stringifyAddress } from './address.util';
import { firstValueFrom } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { error } from '@bk/util';
import { ENV } from '@bk/util';

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private toastController = inject(ToastController);
  private env = inject(ENV);
  private apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private http: HttpClient) {}

  /**
   * Convert an address to latitude and longitude coordinates using the Google Maps Geocoding API
   * @param address in stringified format or as an AddressModel
   * @returns latitude and longitude coordinates as numbers
   */
  public async geocodeAddress(address: AddressModel | string): Promise<GeoCoordinates | undefined> {
    if (!address) return undefined;
    let _addressStr = '';
    if (typeof address === 'string') {
      _addressStr = address; 
    } else {      // address is of type AddressModel
      if (address.category !== AddressChannel.Postal) return undefined;
      _addressStr = stringifyAddress(address);
    }

    const params = { address: _addressStr, key: this.env.services.gmapKey }; 
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const _result = await firstValueFrom(this.http.get<any>(this.apiUrl, { params: params }));
      if (_result.results && _result.results.length > 0) {
        const _location = _result.results[0].geometry.location;
        return { lat: _location.lat, lng: _location.lng };
      } else {
        error(this.toastController, 'Address not found');
        return undefined;
      }  
    }
    catch (_ex) {
      error(this.toastController, 'Error geocoding address');
      console.error('GeocodingService.geocodeAddress -> ERROR: ', _ex);
      return undefined;
    }
  }
}
