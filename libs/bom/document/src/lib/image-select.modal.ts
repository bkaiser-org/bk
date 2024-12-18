import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { IonButton, IonContent, IonIcon, ModalController, Platform } from '@ionic/angular/standalone';
import { Image, newImage } from '@bk/models';
import { ModelType } from '@bk/categories';
import { ENV, getImgixUrlWithAutoParams } from '@bk/util';
import { BkHeaderComponent, BkTextInputComponent } from '@bk/ui';
import { pickPhoto, uploadFileToModel } from './document.util';

/**
 * This modal requests a user to select an image file and provide some metadata about the image.
 */
@Component({
  selector: 'bk-image-select-modal',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, SvgIconPipe,
    BkHeaderComponent, BkTextInputComponent,
    IonContent, IonButton, IonIcon
  ],
  template: `
      <bk-header title="{{ '@content.section.operation.selectImage.title' | translate | async }}" [isModal]="true" />
      <ion-content>
        <ion-button (click)="pickImage()">
          <ion-icon slot="start" src="{{'camera' | svgIcon }}" />
          {{ '@content.section.operation.selectImage.upload' | translate | async }}
        </ion-button>
        <bk-text-input name="imageLabel" value="" (changed)="updateField('imageLabel', $event)" [showHelper]=true />
        <bk-text-input name="imageOverlay" value="" (changed)="updateField('imageOverlay', $event)" [showHelper]=true />
        <bk-text-input name="altText" value="" (changed)="updateField('altText', $event)" [showHelper]=true />
        <ion-button [disabled]="!canSave" (click)="save()">
          {{ '@general.operation.change.ok' | translate | async }}
        </ion-button>
      </ion-content>
  `
})
export class ImageSelectModalComponent {
  private readonly modelController = inject(ModalController);
  private readonly platform = inject(Platform);
  private readonly env = inject(ENV);

  public key = input.required<string>();     // usually the key of a section
  public modelType = input(ModelType.Section); // the model type of the key

  protected image = newImage();
  // maybe we need to set sizes: '(max-width: 1240px) 50vw, 300px'
  protected canSave = false;

  // select a photo from the camera or the photo library
  protected async pickImage() {
    const _file = await pickPhoto(this.platform);
    const _key = this.key();
    if (_file && _key) {
      // upload the file to the storage
      const _path = await uploadFileToModel(this.modelController, this.env.auth.tenantId, _file, this.modelType(), _key);
      if (_path) {
        this.image.url = _path;
        this.image.actionUrl = getImgixUrlWithAutoParams(_path);
      }      
      this.canSave = this.checkCanSave();
    }
  }
  
  protected updateField(fieldName: string, value: string) {
    this.image[fieldName as keyof Image] = value as never;
    this.canSave = this.checkCanSave();
  }

  // overlay is optional
  private checkCanSave(): boolean {
    return this.image.url.length > 0 && 
      this.image.imageLabel.length > 0 &&
      this.image.actionUrl.length > 0 &&
      this.image.altText.length > 0;
  }

  protected save() {
    this.modelController.dismiss(this.image, 'confirm');
  }
}
