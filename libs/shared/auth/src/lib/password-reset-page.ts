/* eslint-disable no-useless-escape */
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { getImgixUrlWithAutoParams, navigateByUrl, ENV } from '@bk/util';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCol, IonContent, IonGrid, IonImg, IonInput, IonItem, IonLabel, IonNote, IonRow } from '@ionic/angular/standalone';
import { BkHeaderComponent } from '@bk/ui';
import { AuthService } from './auth.service';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';


@Component({
    selector: 'bk-password-reset-page',
    standalone: true,
    imports: [
      TranslatePipe, AsyncPipe, 
      FormsModule, 
      BkHeaderComponent,
      IonContent, IonImg, IonLabel, IonItem, IonInput, IonNote, IonGrid, IonRow, IonCol, IonButton
    ],
    styles: `
    .login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.background-image {
  filter: blur(8px);
  -webkit-filter: blur(8px);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
  z-index: 1;
}

.login-form {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  width: 90%;
  text-align: center;
  z-index: 5;
}

.title {
  text-align: center;
  font-size: 2rem;
}

.logo {
  max-width: 300px;
  text-align: center;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  z-index: 10;
}

.button-container {
  margin-top: 20px;
}

.native-input {
  background-color: white;
}
    `,
    template: `
      <bk-header title="{{'@auth.operation.pwdreset.title' | translate | async }}" />
      <ion-content>
        <div class="login-container">
          <img class="background-image" [src]="backgroundImageUrl" alt="Background Image" />
          <div class="login-form">
            <ion-img class="logo" [src]="logoUrl" alt="logo" (click)="gotoHome()"></ion-img>
            <ion-label class="title"><strong>{{ '@auth.operation.pwdreset.title' | translate | async }}</strong></ion-label>
            <ion-item lines="none">
              <ion-input [(ngModel)]="email"
                [autofocus]="true"
                type="email"
                [clearInput]="true"
                [counter]="true"
                maxlength="30"
                label="{{ '@input.loginEmail.label' | translate | async }}"
                labelPlacement="floating"
                required
                errorText="{{'@input.loginEmail.error' | translate | async}}"
                placeholder="{{ '@input.loginEmail.placeholder' | translate | async }}">
              </ion-input>
            </ion-item>
            <ion-item lines="none">
              <ion-note>{{'@auth.operation.pwdreset.note' | translate | async}}</ion-note>
            </ion-item>
              <div class="button-container">
                <ion-grid>
                  <ion-row>
                    <ion-col size="4">
                      <ion-button expand="block" fill="outline" (click)="gotoHome()">{{'@general.operation.change.cancel' | translate | async}}</ion-button>
                    </ion-col>
                    <ion-col size="2" offset="6">
                      <ion-button expand="block" [disabled]="!email || email.length < 5 || !email.includes('@') || !email.includes('.')" (click)="resetPassword()">{{'@general.operation.change.ok' | translate | async}}</ion-button>
                    </ion-col>
                  </ion-row>
                </ion-grid>
            </div>  
          </div>
        </div>
      </ion-content>
    `
})
export class PasswordResetPageComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private env = inject(ENV);

  public logoUrl = `${this.env.app.imgixBaseUrl}/${getImgixUrlWithAutoParams(this.env.app.logoUrl)}`;
  public backgroundImageUrl = `${this.env.app.imgixBaseUrl}/${getImgixUrlWithAutoParams(this.env.app.welcomeBannerUrl)}`;
  public email: string | undefined;

  /**
  * If the form is valid it will call the AuthData service to reset the user's password displaying a loading
  * component while the user waits.
  */
    public async resetPassword(): Promise<void> {
      if (this.email) {
        await this.authService.resetPassword(this.email);
      }
    }

  /**
   * Change to the Home page.
   */
  public async gotoHome(): Promise<void> {
    await navigateByUrl(this.router, this.env.app.rootUrl);
  }
}
