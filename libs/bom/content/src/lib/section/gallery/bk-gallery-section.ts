import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, input, viewChild } from '@angular/core';
import { downloadToBrowser } from '@bk/util';
import { Image, SectionModel } from '@bk/models';
import { BkLabelComponent, BkSpinnerComponent } from '@bk/ui';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { register, SwiperContainer } from 'swiper/element/bundle';

register(); // globally register Swiper's custom elements.

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
      background: #000;
      font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
      font-size: 14px;
      color: #000;
      margin: 0;
      padding: 0;
    }
    swiper-container { 
      width: 100%;
      height: 100%;
    }

    swiper-slide {
      text-align: center;
      font-size: 18px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    swiper-slide bk-img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .main {
      height: 80%;
      width: 100%;
    }
    .thumbs {
      height: 20%;
      box-sizing: border-box;
      padding: 10px 0;
    }
    .thumbs swiper-slide {
      width: 20%;
      height: 100%;
      opacity: 0.4;
    }
    .thumbs .swiper-slide-thumb-active {
      opacity: 1;
    }
  `],
  template: `
    @if(section(); as section) {
      @if(section.properties.imageList; as imageList) {
         <swiper-container #mainSwiper class="main" space-between="10" loop="true" navigation="true" thumbs-swiper=".thumbs">
          @for(image of imageList; track image.url) {
            <swiper-slide [style]="'background-image:url(' + image.actionUrl + ')'" />
          }
        </swiper-container>
        <swiper-container #thumbsSwiper class="thumbs" space-between="10" slides-per-view="4" loop="true" free-mode="true"  watch-slides-progress="true">
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
  private mainSwiper = viewChild<SwiperContainer>('mainSwiper');

  constructor() {
    effect(() => {
      console.log('BkGallerySectionComponent -> section: ', this.section());
      console.log('BkGallerySectionComponent -> mainSwiper: ', this.mainSwiper);
      console.log('BkGallerySectionComponent -> activeIndex: ', this.mainSwiper?.arguments.activeIndex);
    });
  }
  public show(image: Image): void {
    downloadToBrowser(image.actionUrl);
  }
}
