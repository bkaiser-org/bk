import { Component, ViewEncapsulation, inject } from '@angular/core';
import { Router } from '@angular/router';
import { getImgixUrlWithAutoParams, navigateByUrl, ENV } from '@bk/util';
import { IonButton, IonCol, IonContent, IonGrid, IonImg, IonItem, IonLabel, IonNote, IonRow } from '@ionic/angular/standalone';
import { BkHeaderComponent } from '@bk/ui';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { AuthService } from './auth.service';
import { LoginFormComponent } from './login.form';
import { AuthCredentials } from '@bk/models';

@Component({
  selector: 'bk-login-page',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, 
    BkHeaderComponent, LoginFormComponent,
    IonContent, IonImg, IonLabel, IonNote, IonGrid, IonRow, IonCol, IonButton, IonItem
  ],
  styles: `
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
  @media (width <= 600px) {
    .login-form { background-color: white; width: 100%; text-align: center; z-index: 5; }
    .login-container {  display: flex; height: 100%; padding: 10px; }
  }
  @media (width > 600px) {
    .login-form { background-color: white; border-radius: 10px; max-width: 600px; width: 90%; text-align: center; z-index: 5; }
    .login-container {  display: flex; align-items: center; justify-content: center; height: 100%; padding: 20px; margin: 20px; }
  }
  .title { text-align: center; font-size: 2rem; padding: 20px; }
  .logo { max-width: 150px; text-align: center; display: block; margin-left: auto; margin-right: auto; width: 50%; z-index: 10; padding: 20px; }
  ion-col { justify-content: center; align-items: center; }
  `,
  template: `
  <bk-header title="{{ '@auth.operation.login.title' | translate | async }}" />
  <ion-content>
    <div class="login-container">
      <img class="background-image" [src]="backgroundImageUrl" alt="Background" />
      @defer () {
        <div class="login-form">
          <ion-grid>
            <ion-row>
              <ion-img class="logo" [src]="logoUrl" alt="logo" (click)="gotoHome()" />
            </ion-row>
            <ion-row>
              <ion-col size="12">
                <ion-label class="title"><strong>{{ '@auth.operation.login.title' | translate | async}}</strong></ion-label>
              </ion-col>
            </ion-row>
            <ion-row>
              <bk-login-form (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)" />
            </ion-row>
            <ion-row>
              <ion-col size="12">
              <ion-item lines="none">
                <ion-button slot="start" size="default" fill="outline" (click)="gotoHome()">{{ '@general.operation.change.cancel' | translate | async }}</ion-button>
                <ion-button slot="end" size="default" [disabled]="!formCanBeSaved" (click)="login()">{{ '@auth.operation.login.title' | translate | async}}</ion-button>
              </ion-item>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="12">
              <ion-note>{{'@auth.operation.login.note' | translate | async}}</ion-note>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="12">
                <ion-button fill="outline" (click)="resetPassword()" size="small" >{{ '@auth.operation.pwdreset.title' | translate | async }}</ion-button>
              </ion-col>  
            </ion-row>
          </ion-grid>
        </div>
      }
    </div>
  </ion-content>
  `,
  encapsulation: ViewEncapsulation.None
})
export class LoginPageComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly env = inject(ENV);

  public logoUrl = `${this.env.app.imgixBaseUrl}/${getImgixUrlWithAutoParams(this.env.app.logoUrl)}`;
  public backgroundImageUrl = `${this.env.app.imgixBaseUrl}/${getImgixUrlWithAutoParams(this.env.app.welcomeBannerUrl)}`;

  protected formCanBeSaved = false;
  public currentCredentials: AuthCredentials | undefined;
  
  public onDataChange(form: AuthCredentials): void {
    this.currentCredentials = form;
  }

  public onFormStateChange(formCanBeSaved: boolean): void {
    this.formCanBeSaved = formCanBeSaved;
  }

  public async gotoHome(): Promise<void> {
    await navigateByUrl(this.router, this.env.app.rootUrl);
  }

  /**
   * Login a returning user with already existing credentials.
   */
  public async login(): Promise<void> {
    if (this.currentCredentials?.email && this.currentCredentials?.password) {
      this.authService.login(this.currentCredentials.email, this.currentCredentials.password);
    }
  }

  public async resetPassword(): Promise<void> {
    await navigateByUrl(this.router, this.env.auth.passwordResetUrl);
  }
}

