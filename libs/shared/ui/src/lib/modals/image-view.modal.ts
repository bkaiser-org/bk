import { AsyncPipe, NgOptimizedImage, provideImgixLoader } from '@angular/common';
import { Component, computed, ElementRef, input, viewChild } from '@angular/core';
import { ImgixUrlPipe, TranslatePipe } from '@bk/pipes';
import { IonContent } from '@ionic/angular/standalone';
import { BkHeaderComponent } from '../structural/bk-header';
import { Image } from '@bk/models';

@Component({
  selector: 'bk-image-view-modal',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, ImgixUrlPipe,
    BkHeaderComponent,
    IonContent, NgOptimizedImage
  ],
  providers: [
    provideImgixLoader('https://bkaiser.imgix.net')
  ],
  styles: [`
    .image-container { position: relative; display: flex; justify-content: center; align-items: center; width: 100%; height: auto; }
  `],
  template: `
      <bk-header title="{{ title() | translate | async }}" [isModal]="true" />
      <ion-content>
        @if(image(); as image) {
          <div class="image-container">
            <img [ngSrc]="(image | imgixUrl)" [alt]="image.altText" [sizes]="sizes()"
              [attr.priority]="true"
              [attr.fill]="true"
              [width]="image.width" 
              [height]="image.height"
              placeholder 
            />
          </div>
        }
      </ion-content>
  `
})
export class ImageViewModalComponent {
  public image = input.required<Image>();
  public title = input('');

  protected imageContainer = viewChild('.image-container', { read: ElementRef });
  protected sizes = computed(() => this.image().sizes ?? '(max-width: 768px) 100vw, 50vw');
}



