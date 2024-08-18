import { Component, inject } from '@angular/core';
import { navigateByUrl, ConfigService, getImgixUrlWithAutoParams } from '@bk/util';
import { IonCol, IonContent, IonGrid, IonIcon, IonImg, IonLabel, IonRow } from '@ionic/angular/standalone';
import { BkHeaderComponent, BkImgComponent } from '@bk/ui';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'bk-page-not-found',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    BkHeaderComponent, BkImgComponent,
    IonContent, IonGrid, IonRow, IonCol, IonLabel, IonImg, IonIcon
  ],
  styles: [`
     .notfound-container { 
      display: flex; 
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .background-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.7;
      z-index: 1;
    }

    .notfound-form {
      background-color: rgba(255, 255, 255);
      padding: 20px;
      border-radius: 10px;
      width: 600px;
      max-width: 600px;
      width: 90%;
      text-align: center;
      z-index: 5;
    }

    .title { text-align: center; font-size: 2rem; }
    .subtitle { text-align: center; font-size: 1.2rem; }
    .help { text-align: center; font-size: 1rem; }

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
        <img class="background-image" [src]="backgroundImageUrl" alt="Background" />
        <ion-grid class="notfound-form">
        <ion-row>
            <ion-col>
              <ion-img class="logo" [src]="logoUrl" alt="{{ logoAlt }}" (click)="gotoHome()" />
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
export class PageNotFoundComponent {
  private router = inject(Router);
  private configService = inject(ConfigService);

  public baseImgixUrl = this.configService.getConfigString('cms_imgix_base_url');
  public logoUrl = this.baseImgixUrl + '/' + getImgixUrlWithAutoParams(this.configService.getConfigString('cms_logo_url'));
  public backgroundImageUrl = this.baseImgixUrl + '/' + getImgixUrlWithAutoParams(this.configService.getConfigString('cms_welcome_banner_url'));
  public logoAlt = this.configService.getConfigString('tenant_name') + ' Logo';
  public rootUrl = this.configService.getConfigString('cms_root_url');

  public async gotoHome(): Promise<void> {
    console.log('Navigating to home page');
    await navigateByUrl(this.router, this.configService.getConfigString('cms_root_url'));
  }
}
