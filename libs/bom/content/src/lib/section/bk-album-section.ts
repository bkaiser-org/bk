import { Component, computed, input } from '@angular/core';
import { downloadToBrowser } from '@bk/util';
import { Image, SectionModel } from '@bk/models';
import { ImgixUrlPipe, TranslatePipe } from '@bk/pipes';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonItem, IonRow } from '@ionic/angular/standalone';
import { BkImgComponent, BkLabelComponent, BkSpinnerComponent } from '@bk/ui';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bk-album-section',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    BkSpinnerComponent, BkLabelComponent, BkImgComponent, ImgixUrlPipe,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonGrid, IonRow, IonCol, IonItem
  ],
  styles: [`
    ion-card-content { padding: 0px; }
    ion-card { padding: 0px; margin: 0px; border: 0px; box-shadow: none !important;}
    .image-container { min-height: 200px; background-size: cover; background-position: center; border: 1px; }

    @media(min-width: 0px) { .pinterest-album { column-count: 2; } }
    @media(min-width: 420px) { .pinterest-album { column-count: 3; } }
    @media(min-width: 720px) { .pinterest-album { column-count: 4; } }
    .pinterest-image { margin: 2px; }

    @media(min-width: 0px) { .imgix-image { sizes: 100vw; } }
    @media(min-width: 640px) { .imgix-image { sizes: 50vw; } }
    @media(min-width: 960px) { .imgix-image { sizes: 33vw; } }
  `],
  template: `
      <ion-card>
        <ion-card-content>
          @if(numberOfImages() > 0) {
            @switch (albumType()) {
              @case('pinterest') {
                <!--
                  With Pinterest-style album, the images are not strictly aligned and just take the
                  space available.
                  source: https://ionicacademy.com/ionic-image-gallery-responsive/ 
                -->
                <div class="pinterest-album">
                  @for(image of imageList(); track image) {
                    <div class="pinterest-image">
                      <bk-img [image]="patchImage(image)" />  
                    </div>
                  }
                </div>
              }
              @case('imgix') {
                <div class="imgix-album">
                  @for(image of imageList(); track image) {
                    <div class="imgix-image">
                      <bk-img [image]="patchImage(image)" />  
                    </div>
                  }
                </div>
              }
              @default { <!-- grid -->
                <!-- 
                  we set the image to the background-image attribute of a div so we
                  can scale it to fill the whole column more easily.
                  source: https://ionicacademy.com/ionic-image-gallery-responsive/ 
                -->
                <ion-grid>
                  <ion-row>
                    @for(image of imageList(); track image) {
                      <ion-col size="6" size-xl="3" size-md="4" (click)="show(image)">
                        <bk-img [image]="patchImage(image)" />  
                      </ion-col>
                    }
                  </ion-row>
                </ion-grid>
              }
            }
          } @else {
            <bk-label>{{ '@content.section.error.noImages' | translate | async }}</bk-label>
          }
        </ion-card-content>
      </ion-card>
  `
})
export class BkAlbumSectionComponent {
  public section = input<SectionModel>();
  protected imageList = computed(() => this.section()?.properties.imageList ?? []);
  protected numberOfImages = computed(() => this.imageList().length);
  protected albumType = computed(() => this.section()?.properties.defaultImageConfig?.albumStyle ?? 'grid');

  // tbd: action: download, gallery, slider, call, zoom
  public show(image: Image): void {
    downloadToBrowser(image.downloadUrl);
  }

  patchImage(image: Image): Image {
    image.isZoomable = true;
    image.fill = true;
    // tbd: styles (separate for album images and zoomed images):
    // 'border': 'solid 1px',
    // 'padding': '10px',
    // 'margin': '5px',

    return image;
  }
}
