import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, input, OnInit, viewChild } from '@angular/core';
import { die, downloadToBrowser, getSizedImgixParamsByExtension, ENV } from '@bk/util';
import { Image, ImageMetaData, ImageType, SectionModel } from '@bk/models';
import { ImgixUrlPipe, SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { IonAvatar, IonButtons, IonCard, IonCardContent, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonRow, IonThumbnail, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { BkCatComponent, BkImgComponent, BkLabelComponent, BkSpinnerComponent, BkVideoComponent, showZoomedImage } from '@bk/ui';
import { AsyncPipe, NgStyle } from '@angular/common';
import { Browser } from '@capacitor/browser';
import { AlbumStyle, AlbumStyles, Category, DefaultAlbumStyle, ImageAction } from '@bk/categories';
import { AlbumService } from './album.service';
import { AuthorizationService } from '@bk/base';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

/**
 * A Section that shows a hierarchical file structure as an album.
 * All files within a directory are listed with thumbnail images.
 * There are several styles to display the images: grid, pinterest, imgix, list, avatarList.
 * A click on an image can trigger different actions: zoom, open directory, open file, open link, open modal, open dialog (configurable ImageAction).
 * 
 * TBD:
 * - change dir icon to dir and name of dir (later: add a background image)
 * - optimize the styling of the images (e.g. imgix)
 * - add a toolbar in AlbumSection to allow the user to change the album style
 * - show exif info for images as an overlay (imgix fm=json)
 * - support non-image files (thumbnail for pdfs, other files should be presented with the filetype icons)
 * - implement the different image actions
 * - implement multiple file upload (drag and drop)
 */
@Component({
  selector: 'bk-album-section',
  standalone: true,
  imports: [
    NgStyle,
    TranslatePipe, AsyncPipe, SvgIconPipe,
    BkSpinnerComponent, BkLabelComponent, BkImgComponent, ImgixUrlPipe, BkCatComponent, BkVideoComponent,
    IonCard, IonCardContent, IonAvatar, IonList, IonThumbnail,
    IonGrid, IonRow, IonCol, IonItem, IonToolbar, IonTitle, IonIcon, IonLabel, IonButtons
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [`
    ion-label { text-align: center; }
    ion-card-content { padding: 0px; }
    ion-card { padding: 0px; margin: 0px; border: 0px; box-shadow: none !important;}

    @media(min-width: 0px) { .pinterest-album { column-count: 2; } }
    @media(min-width: 420px) { .pinterest-album { column-count: 3; } }
    @media(min-width: 720px) { .pinterest-album { column-count: 4; } }
    .pinterest-image { margin: 2px; text-align: center; }

    @media(min-width: 0px) { .imgix-image { sizes: 100vw; } }
    @media(min-width: 640px) { .imgix-image { sizes: 50vw; } }
    @media(min-width: 960px) { .imgix-image { sizes: 33vw; } }
  `],
  template: `
    @if(isLoading()) {
      <bk-spinner></bk-spinner>
    } @else {
      <ion-toolbar>
        <ion-grid>
          <ion-row>
            <ion-col size="8">
                @if(isTopDirectory() === false) {
                  <ion-item lines="none">
                    <ion-icon src="{{ 'arrow-up-circle-outline' | svgIcon}}" (click)="goUp()" slot="start" />
                    <ion-title>{{ title() }}</ion-title>
                  </ion-item>
                } @else {
                  <ion-title>Album</ion-title>
                }
            </ion-col>
            <ion-col size="4">
                <bk-cat [config]="config()" (ionChange)="onAlbumStyleChange($event)" />
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-toolbar>
      <ion-card>
        <ion-card-content>
            @if(images(); as images) {
              @switch (albumStyle()) {
                @case(AS.Pinterest) {
                  <!--
                    With Pinterest-style album, the images are not strictly aligned and just take the
                    space available.
                    source: https://ionicacademy.com/ionic-image-gallery-responsive/ 
                  -->
                  <div class="pinterest-album">
                    @for(image of images; track image) {
                      <div class="pinterest-image">
                        @switch(image.imageType) {
                            @case(IT.Dir) {
                              <img [src]="env.app.imgixBaseUrl + '/' + image.url + '?fm=jpg&auto=format,compress,enhance&fit=crop'" [alt]="image.altText" (click)="onImageClicked(image)"/>
                              <ion-label>{{ image.imageLabel }}</ion-label>
                            } @case(IT.Image) {
                              <img [src]="env.app.imgixBaseUrl + '/' + image.url + '?fm=jpg&auto=format,compress,enhance&fit=crop'" [alt]="image.altText" (click)="onImageClicked(image)"/>
                            } @case(IT.StreamingVideo) {
                              <bk-video [url]="image.url" />
                            } @case (IT.Pdf) {
                              <img [src]="env.app.imgixBaseUrl + '/' + image.url + '?page=1'" [alt]="image.altText" (click)="onImageClicked(image)"/>
                            }
                            @default {
                              <img [src]="env.app.imgixBaseUrl + '/' + image.url + '?fm=jpg&auto=format,compress,enhance&fit=crop'" [alt]="image.altText" (click)="onImageClicked(image)"/>
                              <ion-label>{{ image.imageLabel }}</ion-label>
                            }
                          }
                      </div>
                    }
                  </div>
                }
                @case(AS.Imgix) {
                  <div class="imgix-album">
                    @for(image of images; track image) {
                      <div class="imgix-image">
                        @switch(image.imageType) {
                          @case(IT.Dir) {
                            <bk-img [image]="image"  (click)="onImageClicked(image)"/>
                            <ion-label>{{ image.imageLabel }}</ion-label>
                          } @case(IT.Image) {
                            <bk-img [image]="convertThumbnailToFullImage(image)"  (click)="getMetaData(image)"/>
                          } @case(IT.StreamingVideo) {
                            <bk-video [url]="image.url" />
                          } @case (IT.Pdf) {
                            <img [src]="env.app.imgixBaseUrl + '/' + image.url + '?page=1'" [alt]="image.altText" (click)="onImageClicked(image)"/>
                          }
                          @default {
                            <bk-img [image]="image"  (click)="onImageClicked(image)"/>
                            <ion-label>{{ image.imageLabel }}</ion-label>
                          }
                        }
                      </div>
                    }
                  </div>

                }
                @case(AS.List) {
                  <ion-list>
                    @for(image of images; track image) {
                      <ion-item (click)="onImageClicked(image)">
                        <ion-label>{{ image.imageLabel }}</ion-label>
                      </ion-item>
                    }
                  </ion-list>
                }
                @case(AS.AvatarList) {
                  <ion-list>
                    @for(image of images; track image) {
                      <ion-item>
                        <ion-thumbnail slot="start">
                          <img [src]="env.app.imgixBaseUrl + '/' + image.url + '?fm=jpg&width=200&height=200&auto=format,compress,enhance&fit=crop'" [alt]="image.altText" (click)="onImageClicked(image)"/>
                        </ion-thumbnail>
                        <ion-label>{{ image.imageLabel }}</ion-label>
                      </ion-item>
                    }
                  </ion-list>
                }
                @default { <!-- grid -->
                  <!-- 
                    we set the image to the background-image attribute of a div so we
                    can scale it to fill the whole column more easily.
                    source: https://ionicacademy.com/ionic-image-gallery-responsive/ 
                  -->
                  <ion-grid>
                    <ion-row>
                      @for(image of images; track image; let i = $index) {
                        <!-- 2 images on small screens, 3 on medium, 4 images on large screens -->
                        <ion-col size="6" size-xl="3" size-md="4">
                          @switch(image.imageType) {
                            @case(IT.Dir) {
                              <bk-img [image]="image" (click)="onImageClicked(image)"/>
                              <ion-label>{{ image.imageLabel }}</ion-label>
                            } @case(IT.Image) {
                              <div class="image-container" [ngStyle]="getBackgroundStyle(image)" (click)="onImageClicked(image, i)"></div>
                            } @case(IT.StreamingVideo) {
                              <bk-video [url]="image.url" />
                            } @case (IT.Pdf) {
                              <div class="image-container" [ngStyle]="getBackgroundStyle(image)" (click)="onImageClicked(image, i)"></div>
                            }
                            @default {
                              <bk-img [image]="image" (click)="onImageClicked(image)"/>
                              <ion-label>{{ image.imageLabel }}</ion-label>
                            }
                          }
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
    }
  `
})
export class AlbumSectionComponent implements OnInit {
  private readonly modalController = inject(ModalController);
  protected authorizationService = inject(AuthorizationService);
  protected albumService = inject(AlbumService);
    private httpClient = inject(HttpClient);
  protected env = inject(ENV);

  public section = input<SectionModel>();
  protected album = computed(() => this.section()?.properties.album);

  protected initialDirectory = computed(() => this.album()?.directory ?? '');
  protected initialAlbumStyle = computed(() => this.album()?.albumStyle ?? DefaultAlbumStyle);
  protected initialDirLength = computed(() => this.initialDirectory().split('/').length);
  protected imageContainer = viewChild('.imgix-image', { read: ElementRef });

  protected directory = this.albumService.directory;
  protected albumStyle = this.albumService.albumStyle;
  protected images = this.albumService.images;
  protected isLoading = this.albumService.isLoading;
  protected error = this.albumService.error;
  protected title = this.albumService.title;
  protected currentDirLength = this.albumService.currentDirLength;
  protected parentDirectory = this.albumService.parentDirectory;
  protected isTopDirectory = computed(() => this.currentDirLength() === this.initialDirLength());
  public config = computed(() => { 
    return {
      categories: AlbumStyles,
      selectedCategoryId: this.initialAlbumStyle() ?? DefaultAlbumStyle,
      label: '@categories.albumStyle.name'
    }
  });

  protected baseImgixUrl = this.env.app.imgixBaseUrl;
  protected IA = ImageAction;
  protected IT = ImageType;
  protected AS = AlbumStyle;

  ngOnInit() {
    this.albumService.initialize(this.section()?.properties.album);
  }

  protected async onImageClicked(image: Image, index = 0): Promise<void> {
    switch (image.imageAction) {
      case ImageAction.Download: await downloadToBrowser(image.actionUrl); break;
      case ImageAction.Zoom: await showZoomedImage(this.modalController, '@content.type.article.zoomedImage', image, 'full-modal'); break;
      case ImageAction.OpenSlider: this.albumService.openGallery(this.images(), this.title(), index); break;
      case ImageAction.OpenDirectory: this.albumService.setCurrentDirectory(image.actionUrl); break;
      case ImageAction.FollowLink: Browser.open({ url: image.actionUrl }); break;
      case ImageAction.None: break;
      default: console.log('AlbumSectionComponent.onImageClicked -> no action defined');
    }
  }

  protected getBackgroundStyle(image: Image) {
    if (!image.width || !image.height) die('AlbumSection: image width and height must be set');
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

  protected goUp(): void {
    this.albumService.goUp();
  }

  protected onAlbumStyleChange($event: Event): void {
    const _category = ($event.target as HTMLInputElement).value as unknown as Category;
    this.albumService.setCurrentAlbumStyle(_category.id);
  }

  protected convertThumbnailToFullImage(image: Image): Image {
    image.imageAction = ImageAction.Download;
    image.isThumbnail = false;
    image.fill = true;
    image.width = this.getValue('width', 900);
    image.height = this.getValue('height', 300);
    return image;
  }

  protected async getMetaData(image: Image): Promise<ImageMetaData> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _data = await firstValueFrom(this.httpClient.get(this.baseImgixUrl + '/' + image.url + '?fm=json')) as any;
    console.log('AlbumSectionComponent.getMetaData -> data: ', _data);

    const _metaData: ImageMetaData = {
      altitude: _data.GPS?.Altitude ?? undefined,
      latitude: _data.GPS?.Latitude ?? undefined,
      longitude: _data.GPS?.Longitude ?? undefined,
      speed: _data.GPS?.Speed ?? undefined,
      direction: _data.GPS?.ImgDirection ?? undefined,
      size: _data['Content-Length'] ?? undefined,
      height: _data.PixelHeight ?? undefined,
      width: _data.PixelWidth ?? undefined,
      cameraMake: _data.TIFF?.Make ?? undefined,
      cameraModel: _data.TIFF?.Model ?? undefined,
      software: _data.TIFF?.Software ?? undefined,
      focalLength: _data.Exif?.FocalLength ?? undefined,
      focalLengthIn35mmFilm: _data.Exif?.FocalLengthIn35mmFilm ?? undefined,
      aperture: _data.Exif?.FNumber ?? undefined,
      exposureTime: _data.Exif?.ExposureTime ?? undefined,
      iso: _data.Exif?.ISOSpeedRatings ?? undefined,
      lensModel: _data.Exif?.LensModel ?? undefined
    };
    console.log('AlbumSectionComponent.getMetaData -> metaData: ', _metaData);
    return _metaData; 
  }

  private getValue(key: string, defaultValue: number): number {
    const _el = this.imageContainer();
    if (_el) {
      const _value = (_el.nativeElement[key] ?? defaultValue) as number;
      console.log(`AlbumSectionComponent.getValue -> element found: ${key} -> value: ${_value}`);
      return _value;
    }
    return defaultValue;
  }
}
