import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { downloadToBrowser } from '@bk/util';
import { Image, SectionModel } from '@bk/models';
import { BkLabelComponent, BkSpinnerComponent } from '@bk/ui';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bk-gallery-section',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    TranslatePipe, AsyncPipe,
    BkSpinnerComponent, BkLabelComponent
  ],
  styles: [`
    html, body { position: relative; height: 100%; }

    body {
      background: #eee;
      font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #000;
      margin: 0;
      padding: 0;
    }
    swiper-container { 
      width: 100%;
      height: 300px;
      margin: 20px auto; 
    }

    swiper-slide {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .gallery-top {
      height: 80%;
      width: 100%;
    }
    .gallery-thumbs {
      height: 20%;
      box-sizing: border-box;
      padding: 10px 0;
    }
    .gallery-thumbs swiper-slide {
      width: 20%;
      height: 100%;
      opacity: 0.4;
    }
    .gallery-thumbs .swiper-slide-active {
      opacity: 1;
    }
  `],
  template: `
    @if(section(); as section) {
      @if(section.properties.imageList; as imageList) {
         <swiper-container class="gallery-top" space-between="10" loop="true" navigation="true" 
          controller-control=".gallery-thumbs" thumbs-swiper=".gallery-thumbs">
          @for(image of imageList; track image.url) {
            <swiper-slide [style]="'background-image:url(' + image.actionUrl + ')'" />
          }
        </swiper-container>
        <swiper-container class="gallery-thumbs" space-between="10" slides-per-view="4" loop="true" free-mode="true" 
          controller-control=".gallery-top" watch-slides-visibility="true" watch-slides-progress="true" slide-to-clicked-slide="true">
          @for(image of imageList; track image.url) {
            <swiper-slide [style]="'background-image:url(' + image.actionUrl + ')'" />
          }
        </swiper-container>
      } @else {
        <bk-label>{{ '@content.section.error.noImages' | translate | async }}</bk-label>
      }
    } @else {
      <bk-spinner />
    }
  `
})
export class BkGallerySectionComponent {
  public section = input<SectionModel>();

  public show(image: Image): void {
    downloadToBrowser(image.actionUrl);
  }
}
