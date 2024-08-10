import { Component, inject } from '@angular/core';
import { AuthService } from '@bk/auth';
import { BkHeaderComponent } from '@bk/ui';
import { closeSubscription, warn } from '@bk/util';
import { Geolocation, Position } from '@capacitor/geolocation';
import { IonButton, IonCol, IonContent, IonGrid, IonLabel, IonRow } from '@ionic/angular/standalone';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'bk-geotracker',
  standalone: true,
  imports: [
    BkHeaderComponent, 
    IonContent, IonGrid, IonRow, IonCol, IonLabel, IonButton
  ],
  template: `
    <bk-header title="GeoTracker" />
    <ion-content #content>
        <ion-grid>
            <ion-row>
                <ion-col>
                        <ion-button (click)="getCurrentPosition()">Get current position</ion-button>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col size="6">
                        <ion-label>Current Position (lat/lon/alt): </ion-label>
                </ion-col>
                <ion-col size="6">
                        <ion-label>{{ currentPosition?.coords?.latitude}} / {{ currentPosition?.coords?.longitude}} / {{ currentPosition?.coords?.altitude}}</ion-label>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                        <ion-button (click)="watchPosition()">Start the Tracker</ion-button>
                        <ion-label><small>interval: 15 min</small></ion-label>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                        <ion-button (click)="stopWatchingPosition()">Stop the Tracker</ion-button>                
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-content>
  `,
})
export class GeotrackerPageComponent {
    public authService = inject(AuthService);
    private watchSubscription: Subscription | undefined;
    private watchId: string | undefined;
    public currentPosition: Position | undefined;

  async getCurrentPosition(): Promise<Position> {
    this.currentPosition = await Geolocation.getCurrentPosition();
    return this.currentPosition;
  }
    
  public async watchPosition() {
    this.watchId = await Geolocation.watchPosition({}, (position, err) => {
      if (err) {
        console.error(err);
      } else {
        if (position) {
            this.currentPosition = position;
            // tbd: write the position to the database (per user)
            // only keep the data for one day (with the exception of admin)
            // make the data downloadable and show it on a map
        }
        console.log('Position changed:', position);
      }
    });
  }

  public async startWatchingPosition(): Promise<void> {
    await this.watchPosition(); // Call the watchPosition() method immediately
    const source = interval(15 * 60 * 1000); // Set the interval to 15 minutes (in milliseconds)
    this.watchSubscription = source.subscribe(async () => await this.watchPosition());
  }

  public async stopWatchingPosition(): Promise<void> {
    if (!this.watchId) {
        warn('geotracker is not running (no watchId)');
    } else {
        await Geolocation.clearWatch({ id: this.watchId }).then(() => {
            console.log('Stopped watching position.');
          });
      closeSubscription(this.watchSubscription);
    }
  }
  
  
  
}



