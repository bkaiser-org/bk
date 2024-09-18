import { Component, computed, inject, model, output } from '@angular/core';
import { Image, newImage, SectionFormModel, SectionProperties } from '@bk/models';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonIcon, IonItem, IonLabel, IonRow, ToastController } from '@ionic/angular/standalone';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { deleteFileFromStorage } from '@bk/util';
import { BkImgComponent, BkSpinnerComponent } from '@bk/ui';
import { DocumentService } from '@bk/document';
import { SectionService } from '../section.service';
import { addIcons } from "ionicons";
import { addCircleOutline, closeCircleOutline } from "ionicons/icons";
import { ImageAction } from '@bk/categories';

/**
 * This form lets a user pick an image and define its properties.
 * The image is picked from the local file system or from the camera.
 * It is then uploaded and user needs to insert some metadata about the image.
 * The image can be removed and replaced.
 */
@Component({
  selector: 'bk-single-image-form',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    IonRow, IonCol, IonButton, IonIcon, IonItem, IonLabel,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    BkSpinnerComponent, BkImgComponent
  ],
  template: `
    @if(vm(); as vm) {
      <ion-row>
        <ion-col size="12">
          <ion-card>
            <ion-card-header>
              <ion-card-title>{{ '@content.section.forms.imageConfig.title' | translate | async }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-item lines="none">
                <ion-button (click)="addImage()" fill="clear">
                  <ion-icon slot="start" name="add-circle-outline" />
                  {{ '@content.section.operation.addImage.label' | translate | async }}
                </ion-button>
              </ion-item>
              @if(image(); as image) {
                <ion-item lines="none">
                  <bk-img [image]="patchImage(image)" (click)="editImage(image)" />
                  <ion-label (click)="editImage(image)">{{image.imageLabel}}</ion-label>
                  <ion-icon name="close-circle-outline" slot="end" (click)="removeImage(image)" />
                </ion-item>
              } @else {
                <bk-spinner />
              }
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    }
  `
})
export class SingleImageFormComponent {
  private documentService = inject(DocumentService);
  private sectionService = inject(SectionService);
  private toastController = inject(ToastController);

  public vm = model.required<SectionFormModel>();
  protected image = computed(() => this.vm().properties?.image ?? newImage());
  public changedProperties = output<SectionProperties>();

  constructor() {
    addIcons({addCircleOutline, closeCircleOutline});
  }

  // call modal with input form to select an image and add metadata
  protected async addImage() {
    const _sectionKey = this.vm().bkey;
    if (_sectionKey) {
      const _image = await this.documentService.pickAndUploadImage(_sectionKey);
      if (_image) {
        this.saveAndNotify(_image);    
      }
    }
  }

  patchImage(image: Image): Image {
    image.isThumbnail = true;
    image.width = 80;
    image.height = 80;
    image.fill = false;
    image.isThumbnail = true;
    image.imageAction = ImageAction.None;
    return image;
  }

  protected async editImage(image: Image) {
    const _image = await this.sectionService.editImage(image);
    if (_image) {
      this.saveAndNotify(_image);
    }
  }

  protected removeImage(image: Image) {
    deleteFileFromStorage(this.toastController, image.url);
    image.url = '';
    image.actionUrl = '';
    this.saveAndNotify(image);
  }

  private saveAndNotify(image: Image) {
    const _properties = this.vm().properties;
    console.log(image);
    if (_properties) {
      _properties.image = image;
    }
    this.changedProperties.emit({
      image
    });
  }
}
