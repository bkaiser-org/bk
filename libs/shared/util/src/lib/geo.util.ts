import { Geolocation } from '@capacitor/geolocation';
import { AlertController, Platform } from '@ionic/angular';

export const SCS_LATITUDE = 47.24434181869306;
export const SCS_LONGITUDE = 8.710534179293512;

export interface GeoPosition {
    latitude: number,
    longitude: number,
    altitude?: number,
    speed?: number,
    heading?: number
}

export async function getCurrentPosition(): Promise<GeoPosition> {
    const _coord = await Geolocation.getCurrentPosition();
    return {
        latitude: _coord.coords.latitude,
        longitude: _coord.coords.longitude,
        altitude: _coord.coords.altitude ? _coord.coords.altitude : undefined,
        speed: _coord.coords.speed ? _coord.coords.speed : undefined,
        heading: _coord.coords.heading ? _coord.coords.heading : undefined
    }
}

export function canShowPosition(platform: Platform): boolean {
    if (platform.is('cordova')) {
      return true;
    } else {
      return false;
    }
  }

/*
for geocoding, reverse-geocoding and tracking examples:
https://medium.com/enappd/use-geolocation-geocoding-and-reverse-geocoding-in-ionic-capacitor-b494264f0e85

wahrscheinlich eine neue lib machen mit möglichst wenig Abhängigkeiten

geo
- geo.util
- geo.service
- Map Pages für Kartendarstellung und Tracking
- längerfristig mit verschiedenen Geo-Providern (Google, Apple, OpenStreetmap)
*/


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function showAddress(alertController: AlertController, address: string): void {

    /*
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      translucent: true,
      animated: true
    });
    await this.loading.present();
    */
//    this.map.clear();

    // Address -> latitude,longitude
/*     Geocoder.geocode({
      'address': address
    })
    .then((results: GeocoderResult[]) => {
      this.loading.dismiss();

      const _marker: Marker = this.map.addMarkerSync({
        'position': results[0].position,
        'title':  JSON.stringify(results[0].position)
      });
      this.map.animateCamera({
        'target': _marker.getPosition(),
        'zoom': 17
      }).then(() => {
        _marker.showInfoWindow();
      });
    }); */
  }

  export enum DirectionFormat {
    Abbreviation,
    Name
  }

  export function getDirectionFromAzimuth(degrees: number, format = DirectionFormat.Abbreviation): string {
    if (degrees < 23) return format === DirectionFormat.Abbreviation ? 'N' : 'Nord';
    if (degrees < 68) return format === DirectionFormat.Abbreviation ?  'NE' : 'Nordost';
    if (degrees < 113) return format === DirectionFormat.Abbreviation ?  'E' : 'Ost';
    if (degrees < 158) return format === DirectionFormat.Abbreviation ?  'SE' : 'Südost';
    if (degrees < 203) return format === DirectionFormat.Abbreviation ?  'S' : 'Süd';
    if (degrees < 248) return format === DirectionFormat.Abbreviation ?  'SW' : 'Südwest';
    if (degrees < 293) return format === DirectionFormat.Abbreviation ?  'W' : 'West';
    if (degrees < 338) return format === DirectionFormat.Abbreviation ?  'NW' : 'Nordwest';
    return format === DirectionFormat.Abbreviation ? 'N' : 'Nord';
}