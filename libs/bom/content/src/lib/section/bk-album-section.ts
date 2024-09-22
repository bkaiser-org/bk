import { Component, computed, inject, input, OnInit } from '@angular/core';
import { die, downloadToBrowser, getSizedImgixParamsByExtension } from '@bk/util';
import { Image } from '@bk/models';
import { ImgixUrlPipe, SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { IonButtons, IonCard, IonCardContent, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRow, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { BkCatComponent, BkImgComponent, BkLabelComponent, BkSpinnerComponent, showZoomedImage } from '@bk/ui';
import { AsyncPipe, NgStyle } from '@angular/common';
import { Browser } from '@capacitor/browser';
import { AlbumStyle, AlbumStyles, Category, ImageAction } from '@bk/categories';
import { AlbumService } from './album/album.service';
import { ENV } from '@bk/util';

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
    BkSpinnerComponent, BkLabelComponent, BkImgComponent, ImgixUrlPipe, BkCatComponent,
    IonCard, IonCardContent,
    IonGrid, IonRow, IonCol, IonItem, IonToolbar, IonTitle, IonIcon, IonLabel, IonButtons
  ],
  styles: [`
    ion-label { text-align: center; }
    ion-card-content { padding: 0px; }
    ion-card { padding: 0px; margin: 0px; border: 0px; box-shadow: none !important;}

    @media(min-width: 0px) { .pinterest-album { column-count: 2; } }
    @media(min-width: 420px) { .pinterest-album { column-count: 3; } }
    @media(min-width: 720px) { .pinterest-album { column-count: 4; } }
    .pinterest-image { margin: 2px; }

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
                        <bk-img [image]="image" (click)="onImageClicked(image)"/>
                      </div>
                    }
                  </div>
                }
                @case(AS.Imgix) {
                  <div class="imgix-album">
                    @for(image of images; track image) {
                      <div class="imgix-image">
                        <bk-img [image]="image"  (click)="onImageClicked(image)"/>
                      </div>
                    }
                  </div>
                }
                <!-- @case(AS.List) { } -->
                <!-- @case(AS.AvatarList) { } -->
                @default { <!-- grid -->
                  <!-- 
                    we set the image to the background-image attribute of a div so we
                    can scale it to fill the whole column more easily.
                    source: https://ionicacademy.com/ionic-image-gallery-responsive/ 
                  -->
                  <ion-grid>
                    <ion-row>
                      @for(image of images; track image) {
                        <!-- 2 images on small screens, 3 on medium, 4 images on large screens -->
                        <ion-col size="6" size-xl="3" size-md="4">
                          @if(image.imageAction === IA.OpenDirectory) {
                            <bk-img [image]="image" (click)="onImageClicked(image)"/>
                            <ion-label>{{ image.imageLabel }}</ion-label>
                          } @else {
                            <div class="image-container" [ngStyle]="getBackgroundStyle(image)" (click)="onImageClicked(image)"></div>
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
export class BkAlbumSectionComponent implements OnInit {
  private modalController = inject(ModalController);
  protected albumService = inject(AlbumService);
  protected env = inject(ENV);

  public initialDirectory = input.required<string>();
  public initialAlbumStyle = input<AlbumStyle>(AlbumStyle.Grid);
  protected initialDirLength = computed(() => this.initialDirectory().split('/').length);

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
      selectedCategoryId: this.initialAlbumStyle() ?? AlbumStyle.Grid,
      label: '@categories.albumStyle.name'
    }
  });

  protected baseImgixUrl = this.env.app.imgixBaseUrl;
  protected IA = ImageAction;
  protected AS = AlbumStyle;

  ngOnInit() {
    this.albumService.setCurrentDirectory(this.initialDirectory());
    this.albumService.setCurrentAlbumStyle(this.initialAlbumStyle());
  }

  protected async onImageClicked(image: Image): Promise<void> {
    console.log('BkAlbumSectionComponent.onImageClicked -> image: ', image);
    switch (image.imageAction) {
      case ImageAction.Download: await downloadToBrowser(image.actionUrl); break;
      case ImageAction.Zoom: await showZoomedImage(this.modalController, '@content.type.article.zoomedImage', image, 'full-modal'); break;
      case ImageAction.OpenSlider: console.log('opening slider is not yet implemented.'); break;
      case ImageAction.OpenDirectory: this.albumService.setCurrentDirectory(image.actionUrl); break;
      case ImageAction.FollowLink: Browser.open({ url: image.actionUrl }); break;
      case ImageAction.None: break;
      default: console.log('BkAlbumSectionComponent.onImageClicked -> no action defined');
    }
  }

  protected getBackgroundStyle(image: Image) {
    if (!image.width || !image.height) die('BkAlbumSection: image width and height must be set');
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
    console.log('BkAlbumSectionComponent.goUp()');
    this.albumService.goUp();
  }

  protected onAlbumStyleChange($event: Event): void {
    const _category = ($event.target as HTMLInputElement).value as unknown as Category;
    this.albumService.setCurrentAlbumStyle(_category.id);
  }
}


