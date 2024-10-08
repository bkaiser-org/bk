import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, inject, input, viewChild } from '@angular/core';
import { ImgixUrlPipe, TranslatePipe } from '@bk/pipes';
import { IonContent } from '@ionic/angular/standalone';
import { Image } from '@bk/models';
import { BkHeaderComponent, BkImgComponent, BkLabelComponent, BkSpinnerComponent } from '@bk/ui';
import { register, SwiperContainer } from 'swiper/element/bundle';
import { die, downloadToBrowser, ENV, getSizedImgixParamsByExtension } from '@bk/util';

register(); // globally register Swiper's custom elements.

@Component({
  selector: 'bk-gallery-modal',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    TranslatePipe, AsyncPipe, ImgixUrlPipe,
    BkHeaderComponent, BkSpinnerComponent, BkLabelComponent, BkImgComponent,
    IonContent
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
    .mainSwiper {
      height: 85%;
      width: 100%;
    }
    .thumbsSwiper {
      height: 15%;
      box-sizing: border-box;
      padding: 10px 0;
    }
    .thumbsSwiper swiper-slide {
      width: 20%;
      height: 100%;
      opacity: 0.4;
    }
    .thumbsSwiper .swiper-slide-thumb-active {
      opacity: 1;
    }
  `],
  template: `
    <bk-header title="{{ title() | translate | async }}" [isModal]="true" />
    <ion-content>
      @if(imageList(); as images) {
        <swiper-container #mainSwiper class="mainSwiper" [loop]="false" [navigation]="true" 
        thumbs-swiper=".thumbsSwiper" [initialSlide]="initialSlide()" autoplay="false" [effect]="effect()">
          @for(image of images; track image.url) {
            <!-- <swiper-slide>
              <bk-img [image]="image" />
            </swiper-slide> -->
            <swiper-slide [style]="getBackgroundStyle(image)" />
          }
        </swiper-container>
        <swiper-container #thumbsSwiper class="thumbsSwiper" space-between="10" slides-per-view="6" loop="false" 
        free-mode="true" watch-slides-progress="true">
          @for(image of images; track image.url) {
            <swiper-slide [style]="getBackgroundStyle(image)"/>
          }
        </swiper-container>
      } @else {
        <bk-label>{{ '@content.section.error.noImages' | translate | async }}</bk-label>
      }
  `
})
export class GalleryModalComponent implements AfterViewInit{
  protected env = inject(ENV);

  protected imageList = input.required<Image[]>();
  protected initialSlide = input(0);
  protected title = input.required<string>();
  protected effect = input('slide');
  protected baseImgixUrl = this.env.app.imgixBaseUrl;
  private readonly mainSwiper = viewChild<SwiperContainer>('mainSwiper');

  /*
  tbd: 
  - set initial slide
  - download Button on image
  - EXIF data overlay
  - done / responsive:  slides-per-view:  2 - 6
  - done / better image layout
  - download all images https://stackoverflow.com/questions/41461337/how-to-download-entire-folder-from-firebase-storage
  - done / show movies or list them separately
  - done / unshow documents or list them separately
  */

  ngAfterViewInit(): void {
    const _swiper = this.mainSwiper();
    if (_swiper) {
    //  _swiper.initialSlide = this.initialSlide();
      console.log('GalleryModalComponent -> mainSwiper: ', _swiper);
   /*    if (_swiper.swiper) {
        console.log('activeIndex: ', _swiper.swiper.activeIndex);
        console.log('autoplay: ', _swiper.swiper.autoplay.running);  
        _swiper.swiper.slideTo(this.initialSlide());
      }
      _swiper.initialSlide = this.initialSlide(); */
    }
  }

  public download(image: Image) {
    downloadToBrowser(image.url);
  }

  protected getBackgroundStyle(image: Image) {
    if (!image.width || !image.height) die('GalleryModalComponent: image width and height must be set');
    const _params = getSizedImgixParamsByExtension(image.url, image.width, image.height);
    const _url = this.baseImgixUrl + '/' + image.url + '?' + _params;
    return { 
      'background-image': `url(${_url})`, 
      'min-height': '200px',
      'background-size': 'cover',
      'background-position': 'center',
      'border': '1px'
    };
  }
}
