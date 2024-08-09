import { CUSTOM_ELEMENTS_SCHEMA, Component, OnDestroy, OnInit, computed, inject, input } from '@angular/core';
import { SectionModel } from '@bk/models';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';
import { ViewPosition } from '@bk/categories';
import { SCS_LATITUDE, SCS_LONGITUDE, die, ConfigService } from '@bk/util';
import { GoogleMap, MapType } from '@capacitor/google-maps';

@Component({
  selector: 'bk-map-section',
  standalone: true,
  styles: [`
  ion-card-content { padding: 0px; }
  ion-card { padding: 0px; margin: 0px; border: 0px; box-shadow: none !important;}
  capacitor-google-map {
  display: inline-block;
  width: 100%;
  height: 400px;
}
  `],
  imports: [
    IonCard, IonCardContent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
      <ion-card>
        <ion-card-content>
          <ion-item>
            <capacitor-google-map id="map" />
          </ion-item>
        </ion-card-content>
      </ion-card>
  `
})
export class BkMapSectionComponent implements OnInit, OnDestroy {
  private configService = inject(ConfigService);

  // MapSection stores the map data in the url field in this format:  "latitude/longitude/zoom" (3 numbers separated by commas)
  public section = input.required<SectionModel>();
  public VP = ViewPosition;
  private map: GoogleMap | undefined;

  private latitude = computed(() => {
    if (this.section().url) {
      const _coords = this.section().url.split(',');
      return parseFloat(_coords[0]);
    }
    return SCS_LATITUDE;
  });
  private longitude = computed(() => {
    if (this.section().url) {
      const _coords = this.section().url.split(',');
      return parseFloat(_coords[1]);
    }
    return SCS_LONGITUDE;
  });
  private zoom = computed(() => {
    if (this.section().url) {
      const _coords = this.section().url.split(',');
      return parseInt(_coords[2]);
    }
    return 15;
  });

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
  if (!_mapRef) die('BkMapSectionComponent.loadMap: Map element not found');

  this.map = await GoogleMap.create({
    id: 'bk-map',               // Unique identifier for this map instance
    element: _mapRef, 
    apiKey: this.configService.getConfigString('gmap_key'), // Google Maps API Key
    config: {
      center: { lat: this.latitude(), lng: this.longitude() },
      zoom: this.zoom(), 
    }
  });
  this.map.setMapType(MapType.Satellite);
  //this.map.enableTrafficLayer(this.enableTrafficLayer);
  //await this.addMarker(this.latitude(), this.longitude());
  /* for (const _coord of this.coordinates) {
    await this.addMarker(_coord);
  } */
}

/**
 * Add a marker to the map
 * @param map 
 * @param location 
 */
public async addMarker(lat: number, lng: number): Promise<string> {
  let _markerId = '';
  if (this.map) {
    _markerId = await this.map.addMarker({
      coordinate: {
        lat: lat,
        lng: lng
      },
      title: 'Marker Title',
      snippet: 'The best place on earth!',
    });
  }
  return _markerId;
}

}