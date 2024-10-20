import { CUSTOM_ELEMENTS_SCHEMA, Component, computed, input } from '@angular/core';
import { SectionModel } from '@bk/models';
import { BkImgComponent, BkSpinnerComponent } from '@bk/ui';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';

register(); // globally register Swiper's custom elements.

@Component({
  selector: 'bk-swiper-section',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BkSpinnerComponent, BkImgComponent,
    IonCard, IonCardContent
  ],
  styles: [`
    html, body { position: relative; height: 100%; }
    ion-card-content { padding: 0px; }
    ion-card { padding: 0px; margin: 0px; border: 0px; box-shadow: none !important;}

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
      justify-content: center;
      align-items: center;
    }
    swiper-slide bk-img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `],
  template: `
    @if(section(); as section) {
      <ion-card>
        <ion-card-content background="black">
          <swiper-container class="mySwiper" loop="true" navigation="true"  style="width: 100%;"
            pagination="true" keyboard="true" mousewheel="true" css-mode="true">
            @for(image of imageList(); track image.url) {
              <swiper-slide>
                <bk-img [image]="image" />
              </swiper-slide>
            }
          </swiper-container>
        </ion-card-content>
      </ion-card>
    } @else {
      <bk-spinner />
    }
  `
})
export class SwiperSectionComponent {
  public section = input<SectionModel>();
  protected imageList = computed(() => this.section()?.properties.imageList ?? []);
}

/** 
 * to use it with code completion:
 * import Swiper from 'swiper';
 * @ViewChild('swiper') swiperRef: ElementRef | undefined;
 * swiper?: Swiper;
 * swiperReady() {
 *  this.swiper = this.swiperRef?.nativeElement.swiper;
 * }
 * goNext() {
 * this.swiper?.slideNext();
 * }
 * 
 * in template:
 * <swiper-container #swiper (afterinit)="swiperReady()"...>
 * see: https://www.youtube.com/watch?v=01jwVb3WLoA
 * 
 * 
 * for image zooming:
 * on swiper-container: [zoom]="true"
 * <div class="swiper-zoom-container"><img src="https://swiperjs.com/demos/images/nature-1.jpg" /></div>
 */