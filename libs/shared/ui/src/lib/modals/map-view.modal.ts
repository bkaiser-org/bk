import { AsyncPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { TranslatePipe } from '@bk/pipes';
import { IonContent, IonImg } from '@ionic/angular/standalone';
import { BkHeaderComponent } from '../structural/bk-header';
import { SCS_LATITUDE, SCS_LONGITUDE, die, ENV} from '@bk/util';
import { GoogleMap, MapType } from '@capacitor/google-maps';

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

@Component({
  selector: 'bk-map-view-modal',
  standalone: true,
  styles: [`
  capacitor-google-map {
  display: inline-block;
  width: 100%;
  height: 100%;
}
  `],
  imports: [
    TranslatePipe, AsyncPipe,
    BkHeaderComponent,
    IonContent, IonImg
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
      <bk-header title="{{ title() | translate | async }}" [isModal]="true" />
      <ion-content>
        <capacitor-google-map id="map" />
      </ion-content>
  `
})
export class MapViewModalComponent implements OnInit, OnDestroy {
  private env = inject(ENV);

  public coordinates = input<GeoCoordinates[]>([]);
  public title = input('@menu.main.info.map');
  public initialPosition = input<GeoCoordinates>({lat: SCS_LATITUDE, lng: SCS_LONGITUDE});
  public zoom = input(15); // The initial zoom level to be rendered by the map
  public enableTrafficLayer = input(false);

  private map: GoogleMap | undefined;
  
  ngOnInit(): void {
      this.loadMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.destroy();
    }
  }

  async loadMap() {
    const _mapRef = document.getElementById('map'); // reference to the capacitor-google-map element
    if (!_mapRef) die('MapViewModal.loadMap: Map element not found');
    this.map = await GoogleMap.create({
      id: 'bk-map',               // Unique identifier for this map instance
      element: _mapRef, 
      apiKey: this.env.services.gmapKey, // Google Maps API Key
      config: {
        center: this.initialPosition(),
        zoom: this.zoom(), 
      }
    });
    this.map.setMapType(MapType.Satellite);
    this.map.enableTrafficLayer(this.enableTrafficLayer());
    await this.addMarker(this.initialPosition());
    for (const _coord of this.coordinates()) {
      await this.addMarker(_coord);
    }
  }

  /**
   * Add a marker to the map
   * @param map 
   * @param location 
   */
  public async addMarker(coords: GeoCoordinates): Promise<string> {
    let _markerId = '';
    if (this.map) {
      _markerId = await this.map.addMarker({
        coordinate: {
          lat: coords.lat,
          lng: coords.lng
        },
        title: this.title(),
        snippet: 'The best place on earth!',
      });
    }
    return _markerId;
  }
}