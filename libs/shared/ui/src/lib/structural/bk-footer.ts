import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { navigateByUrl } from '@bk/util';
import { BkButtonComponent } from '../form/bk-button';
import { IonButton, IonButtons, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'bk-footer',
  standalone: true,
  imports: [
    BkButtonComponent,
    IonToolbar, IonButtons, IonButton, IonIcon, IonTitle
  ],
  styles: [`
    ion-toolbar { height: 80px;
      @media (max-width: 700px) { font-size: 0.5em; }
      @media (max-height: 700px) { display: none; }
    }
    ion-grid { background-color: var(--ion-color-secondary);}
  .ion-button {
    background-color: var(--ion-color-secondary);
    margin-top: 0px;
    margin-bottom: 0px;
  }

  .icon-label { font-size: 0.8em;
    @media (max-width: 700px) {
      font-size: 0.7em;
    }
    @media (max-width: 500px) {
      display: none;
    }
  }
  `],
  template: `
  @if(showFooter()) {
  <ion-toolbar color="secondary">
    @if(isMobile()) {
      <ion-buttons slot="start">
        @if (twitterUrl()) {
          <bk-button iconName="logo-twitter" fill="clear" size="small" (click)="callTwitter()" />
        }
        @if (emailUrl()) {
          <bk-button iconName="send-outline" fill="clear" size="small" (click)="callEmail()" />
        }
      </ion-buttons>
      <ion-title>&copy; 2023/<a href="{{ authorUrl() }}">{{author()}}</a></ion-title>
    } @else {
      <ion-buttons>
        @if (twitterUrl()) {
          <bk-button label="@ui.twitter" iconName="logo-twitter" fill="clear" size="small" (click)="callTwitter()" />
        }
        @if (emailUrl()) {
          <bk-button label="@ui.email" iconName="send-outline" fill="clear" size="small" (click)="callEmail()" />
        }
      </ion-buttons>
      <ion-title>&copy; 2024/<a href="{{ authorUrl() }}">{{author()}}</a></ion-title>
    }
  </ion-toolbar>  
}
  `
})
export class BkFooterComponent {
  public router = inject(Router);
  public showFooter = input(false);
  public isMobile = input(false);
  public twitterUrl = input('');
  public emailUrl = input('');
  public author = input('bkaiser.com');
  public authorUrl = input('https://bkaiser.com');

  public callTwitter(): void {
    navigateByUrl(this.router, this.twitterUrl());
  }

  public callEmail(): void {
    navigateByUrl(this.router, this.emailUrl())
  }
}
