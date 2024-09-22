import { Component, inject, input } from '@angular/core';
import { AppNavigationService } from '@bk/util';
import { IonButton, IonButtons, IonHeader, IonIcon, IonMenuButton, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { BkSearchbarComponent } from './bk-searchbar/bk-searchbar';
import { SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bk-header',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, SvgIconPipe,
    IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonIcon, IonButton,
    BkSearchbarComponent
  ],
  template: `
    <ion-header>
      <ion-toolbar color="secondary">
        <ion-buttons slot="start">
          <ion-menu-button />
        </ion-buttons>
        <ion-title>{{ title() }}</ion-title>
        @if(isRoot() === false) {
          <ion-buttons slot="end">
            <ion-button (click)="back()">
              <ion-icon slot="icon-only" src="{{'close-circle-outline' | svgIcon }}" />
            </ion-button>
          </ion-buttons>
        }
      </ion-toolbar>
      @if(isSearchable()) {
        <ion-toolbar>
          <bk-searchbar placeholder="{{ placeholder() | translate | async }}" />
        </ion-toolbar>
      }
    </ion-header>
  `,
  styles: [`
    ion-toolbar { background-color: #014da2; }
    .back-button-text { display: none; }
    ion-button { background-color: primary !important; }
  `]
})
export class BkHeaderComponent {
  private appNavigationService = inject(AppNavigationService);
  private modalController = inject(ModalController);
  public title = input.required<string>();
  public isModal = input(false);
  public isRoot = input(false);
  public isSearchable = input(false);
  public placeholder = input('@general.operation.search.placeholder');

  public back(): void {
    if (this.isModal()) {
      this.modalController.dismiss(null, 'cancel');
    } else {
      this.appNavigationService.back();
    }
  }
}
