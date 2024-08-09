import { Component, effect, inject, input, output } from '@angular/core';
import { IonAvatar, IonCol, IonGrid, IonIcon, IonImg, IonItem, IonRow, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { Photo } from '@capacitor/camera';
import { AvatarService } from './avatar.service';
import { ImageViewModalComponent } from '../modals/image-view.modal';
import { CategoryPlainNamePipe } from '@bk/pipes';
import { ColorIonic, ColorsIonic } from '@bk/categories';

@Component({
  selector: 'bk-avatar-toolbar',
  standalone: true,
  imports: [
    CategoryPlainNamePipe,
    IonToolbar, IonAvatar, IonImg, IonTitle, IonIcon, IonItem,
    IonGrid, IonRow, IonCol
  ],
  template: `
  <ion-toolbar [color]="color() | categoryPlainName:colorsIonic">
    <ion-avatar (click)="editImage()">
      <ion-img [src]="url" [alt]="alt()" />
      @if(isEditable()) {
        <ion-icon name="camera" />
      }
    </ion-avatar>
 
    @if(title()) {
      <ion-item style="padding:0px !important; --min-height: 30px;" color="primary" lines="none">
        <ion-title style="padding:0px !important;" (click)="showZoomedImage()">{{ title() }}</ion-title>
      </ion-item>
    }
    @if(subTitle()) {
      <ion-item style="padding:0px !important; --min-height: 30px;" color="primary" lines="none">
        <ion-title style="padding:0px !important;"><small>{{ subTitle() }}</small></ion-title>
      </ion-item>
    }
  </ion-toolbar>
  `,
  styles: [`
  ion-avatar { margin: auto; height: 100px; width: 100px; padding: 10px; text-align: right; position: relative;}
  ion-title { margin: auto; width: 100%; text-align: center; padding: 10px; }
  ion-icon { font-size: 24px; position: absolute; bottom: 12px;  right: 12px; }
  `]
})
export class BkAvatarToolbarComponent {
  protected avatarService = inject(AvatarService);
  private modalController = inject(ModalController);

  public key = input.required<string>();
  public isEditable = input<boolean>(false);
  public imageSelected = output<Photo>();

  public url: string | undefined;
  protected colorsIonic = ColorsIonic;

  constructor() {
    effect(async () => {
      this.url = await this.avatarService.getAbsoluteAvatarUrl(this.key());
    });
  }
  public alt = input('Avatar');
  public color = input<ColorIonic>(ColorIonic.Primary);
  public title = input<string | undefined>();
  public subTitle = input<string | undefined>();

  public async editImage(): Promise<void> {
    if (this.isEditable() === false) {  
      this.showZoomedImage();   // zoom the avatar image to show it bigger
    } else {    
      this.uploadPhoto();       // select and upload a new photo
    }
  }

  protected async showZoomedImage(): Promise<void> {
    const _size = 600;
    const _url = await this.avatarService.getAvatarUrl(this.key());
    if (_url) {
      const _modal = await this.modalController.create({
        component: ImageViewModalComponent,
        componentProps: {
          title: this.title(),
          image: {
            url: _url,
            imageLabel: this.title(),
            downloadUrl: '',
            imageOverlay: '',
            altText: this.alt(),
            isThumbnail: false,
            isZoomable: false,
            hasPriority: true,
            width: _size,
            height: _size,
            fill: true,
            sizes: '(min-width: 768px) 50vw, 100vw',
          }}
        });
      _modal.present();
      await _modal.onDidDismiss();  
    }
  }

  private async uploadPhoto(): Promise<void> {
    const _photo = await this.avatarService.takePhoto();

    if (_photo) {
      this.imageSelected.emit(_photo);
    } 
  }
}
