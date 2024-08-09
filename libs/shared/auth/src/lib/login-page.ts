import { Component, ViewEncapsulation, inject } from '@angular/core';
import { Router } from '@angular/router';
import { getImgixUrlWithAutoParams, navigateByUrl } from '@bk/util';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCol, IonContent, IonGrid, IonImg, IonInput, IonItem, IonLabel, IonNote, IonRow } from '@ionic/angular/standalone';
import { BkHeaderComponent } from '@bk/ui';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@bk/util';

@Component({
  selector: 'bk-login-page',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, 
    FormsModule, BkHeaderComponent,
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

ion-input, ion-textarea {
  --background: var(--bk-form-background);
  border-radius: 5px;
  --padding-start: 10px;
  --inner-padding-end: 10px;
 }

  `,
  template: `
  <bk-header title="{{ '@auth.operation.login.title' | translate | async }}" />
<ion-content>
  <div class="login-container">
    <img class="background-image" [src]="backgroundImageUrl" alt="Background" />
    <div class="login-form">
        <ion-img class="logo" [src]="logoUrl" alt="logo" (click)="gotoHome()" />
        <ion-label class="title"><strong>{{ '@auth.operation.login.title' | translate | async}}</strong></ion-label>
        @if(isContentLoaded) {
          <ion-item lines="none">
          <ion-input [(ngModel)]="email" 
            (ionChange)="gotoField(passwordField)"
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
        }
    
        <ion-item lines="none">
          <ion-input [(ngModel)]="password" #passwordField
            type="password"
            [clearInput]="true"
            [counter]="true"
            maxlength="24"
            label="{{ '@input.loginPassword.label' | translate | async }}"
            labelPlacement="floating"
            required
            minlength="6"
            errorText="{{'@input.loginPassword.error' | translate | async}}"
            placeholder="{{ '@input.loginPassword.placeholder' | translate | async }}">
          </ion-input>
        </ion-item>
        <ion-item lines="none">
          <ion-note>{{'@auth.operation.login.note' | translate | async}}</ion-note>
        </ion-item>  
        <div class="button-container">
          <ion-grid>
            <ion-row>
              <ion-col>
                <ion-button [disabled]="!email || !password" (click)="login()">{{ '@auth.operation.login.title' | translate | async}}</ion-button>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>
                <ion-button fill="outline" (click)="resetPassword()" size="small" >{{ '@auth.operation.pwdreset.title' | translate | async }}</ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
    </div>
  </div>
</ion-content>
  `,
  encapsulation: ViewEncapsulation.None
})
export class LoginPageComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private configService = inject(ConfigService);

  public logoUrl = getImgixUrlWithAutoParams(this.configService.getConfigString('cms_logo_url'));
  public backgroundImageUrl = getImgixUrlWithAutoParams(this.configService.getConfigString('cms_welcome_banner_url'));
  public email = '';
  public password = '';
  protected isContentLoaded = false;

  ionViewDidEnter(): void {
    this.isContentLoaded = true;
  }
  
  public async resetPassword(): Promise<void> {
    await navigateByUrl(this.router, this.configService.getConfigString('cms_password_reset_url'));
  }

  public async gotoHome(): Promise<void> {
    await navigateByUrl(this.router, this.configService.getConfigString('cms_root_url'));
  }

  /**
   * Login a returning user with already existing credentials.
   */
  public async login(): Promise<void> {
    this.authService.login(this.email, this.password);
  }

  protected gotoField(element: IonInput): void {
    element.setFocus();
  }
}

