import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ImgixUrlPipe, TranslatePipe } from '@bk/pipes';
import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonImg, IonItem, IonLabel, IonRow, ModalController } from '@ionic/angular/standalone';
import { Image } from '@bk/models';
import { die } from '@bk/util';
import { BkHeaderComponent, BkImgComponent, BkTextInputComponent } from '@bk/ui';
import { ImageAction } from '@bk/categories';

/**
 * This modal requests a user to select an image file and provide some metadata about the image.
 */
@Component({
  selector: 'bk-image-edit-modal',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, ImgixUrlPipe,
    BkHeaderComponent, BkTextInputComponent, BkImgComponent,
    IonContent, IonImg, IonButton, IonIcon, IonLabel, IonItem,
    IonGrid, IonRow, IonCol
],
  template: `
      <bk-header title="{{ '@content.section.forms.imageConfig.editImage' | translate | async }}" [isModal]="true" />
      <ion-content>
        @if(image(); as image) {
          <ion-grid>
            <ion-row>
              <ion-col size="12">
                <bk-img [image]="patchImage(image)" /> 
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="12">
                <ion-item lines="none">
                  <ion-label> {{ '@content.section.forms.imageConfig.imageChangeNok' | translate | async}}</ion-label>
                </ion-item>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="3">
                <ion-item lines="none">
                  <ion-label>{{ 'url' | translate | async}}</ion-label>
                </ion-item>
              </ion-col>
              <ion-col size="9">
                <ion-item lines="none">
                  <ion-label>{{ image.url}}</ion-label>
                </ion-item>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="3">
                <ion-item lines="none">
                  <ion-label>{{ 'downloadUrl' | translate | async}}</ion-label>
                </ion-item>
              </ion-col>
              <ion-col size="9">
                <ion-item lines="none">
                  <ion-label>{{ image.actionUrl}}</ion-label>
                </ion-item>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="12">
                <bk-text-input name="imageLabel" [value]="image.imageLabel" (changed)="updateField('imageLabel', $event)" [showHelper]=true />
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="12">
                <bk-text-input name="imageOverlay" [value]="image.imageOverlay" (changed)="updateField('imageOverlay', $event)" [showHelper]=true />
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="12">
                <bk-text-input name="altText" [value]="image.altText" (changed)="updateField('altText', $event)" [showHelper]=true />
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="2">
                <ion-button [disabled]="!canSave" (click)="save()">
                  {{ '@general.operation.change.ok' | translate | async }}
                </ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        }
      </ion-content>
  `
})
export class ImageEditModalComponent {
  private readonly modalController = inject(ModalController);
  public image = input.required<Image>();
  protected canSave = false;
  
  protected updateField(fieldName: keyof Image, value: string) {
    this.image()[fieldName] = value as never;
    this.canSave = this.checkCanSave();
  }

  patchImage(image: Image): Image {
    image.imageAction = ImageAction.None;
    image.isThumbnail = false;
    image.fill = true;
    image.width = 900;
    image.height = 300;
    return image;
  }

  // overlay is optional
  private checkCanSave(): boolean {
    return this.image().url.length > 0 && 
      this.image().imageLabel.length > 0 &&
      this.image().actionUrl.length > 0 &&
      this.image().altText.length > 0;
  }

  protected save() {
    if (!this.image()) die('ImageEditModal.save: image() is not set');
    this.modalController.dismiss(this.image(), 'confirm');
  }
}
