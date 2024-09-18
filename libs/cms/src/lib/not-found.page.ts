import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { navigateByUrl, ENV } from '@bk/util';
import { IonCol, IonContent, IonGrid, IonIcon, IonImg, IonLabel, IonRow } from '@ionic/angular/standalone';
import { BkHeaderComponent, BkImgComponent } from '@bk/ui';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from "ionicons";
import { informationCircleOutline } from "ionicons/icons";
import { Image, newImage } from '@bk/models';
import { ImageAction } from '@bk/categories';

@Component({
  selector: 'bk-page-not-found',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    BkHeaderComponent, BkImgComponent, BkImgComponent,
    IonContent, IonGrid, IonRow, IonCol, IonLabel, IonImg, IonIcon
  ],
  styles: [`
    .notfound-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      min-height: 700px;
    }
    .notfound-image {
      filter: blur(8px);
      -webkit-filter: blur(8px);
      position: absolute;
      padding: 0;
      padding-top: 0;
      top: 0;
      left: 0;
      width: 100%;
      height: auto;
      min-height: 700px;
      object-fit: cover;
      opacity: 0.7;
      z-index: 1;
    }
    .notfound-form {
      padding: 20px;
      border-radius: 10px;
      width: 600px;
      max-width: 600px;
      width: 90%;
      text-align: center;
      z-index: 5;
    }
    .title {
      text-align: center;
      font-size: 2rem;
    }
    .subtitle {
      text-align: center;
      font-size: 1.2rem;
    }
    .help { 
      text-align: center; 
      font-size: 1rem;
    }
    .logo, ion-button {
      max-width: 300px;
      text-align: center;
      display: block;
      margin-left: auto;
      margin-right: auto;
      width: 50%;
      z-index: 10;
    }
  `],
  template: `
    <bk-header title="{{ '@cms.notfound.title' | translate | async }}" />
    <ion-content>
      <div class="notfound-container">
        <bk-img class="notfound-image" [image]="backgroundImage" />
        <ion-grid class="notfound-form">
          <ion-row>
            <ion-col>
              <bk-img class="logo" [image]="logoImage" (click)="gotoHome()" />
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-label class="title"><strong>{{ '@cms.notfound.title' | translate | async }}</strong></ion-label>
            </ion-col>
          </ion-row>
          <ion-row class="ion-hide-md-down">
            <ion-col>
              <ion-label class="subtitle">{{ '@cms.notfound.subTitle' | translate | async }}</ion-label><br />
            </ion-col>
          </ion-row>
          <ion-row class="ion-hide-md-down">
            <ion-col color="light">
              <ion-label class="help">
                <ion-icon name="information-circle-outline" slot="start" />
                {{ '@cms.notfound.help' | translate | async }}
              </ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  `
})
export class PageNotFoundComponent implements AfterViewInit {
  private router = inject(Router);
  private env = inject(ENV);
  public backgroundImage!: Image;
  public logoImage!: Image;
  protected contentElement = viewChild(BkImgComponent, { read: ElementRef });

  constructor() {
    addIcons({informationCircleOutline});
  }

  ngAfterViewInit(): void {
    this.backgroundImage = {
      imageLabel: '',
      url: this.env.app.notfoundBannerUrl,
      actionUrl: '',
      altText: this.env.auth.tenantId + ' background image',
      imageOverlay: '',
      fill: true,
      sizes: '100vw',
      hasPriority: true,
      imgIxParams: '',
      borderRadius: 4,
      imageAction: ImageAction.Zoom,
      zoomFactor: 2,
      isThumbnail: false,
      slot: 'start'
    };    
    console.log('Background Image:', this.backgroundImage);

    this.logoImage = newImage();
    this.logoImage.url = this.env.app.logoUrl;
    this.logoImage.hasPriority = false;
    this.logoImage.imageAction = ImageAction.Zoom;
    this.logoImage.isThumbnail = false;
    this.logoImage.fill = true;
    this.logoImage.altText = this.env.auth.tenantId + ' Logo';
    this.logoImage.width = 100;
    this.logoImage.height = 100;
  }

  public async gotoHome(): Promise<void> {
    await navigateByUrl(this.router, this.env.app.rootUrl);
  }
}
