import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { TranslatePipe } from '@bk/pipes';
import { IonContent } from '@ionic/angular/standalone';
import { BkHeaderComponent } from '../structural/bk-header';
import { Image } from '@bk/models';
import { BkImgComponent } from '../structural/bk-img/bk-img';

@Component({
  selector: 'bk-image-view-modal',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    BkHeaderComponent, BkImgComponent,
    IonContent
  ],
  template: `
      <bk-header title="{{ title() | translate | async }}" [isModal]="true" />
      <ion-content>
        @if(image(); as image) {
          <bk-img [image]="image" />
        }
      </ion-content>
  `
})
export class ImageViewModalComponent {
  public image = input.required<Image>();
  public title = input('');
}



