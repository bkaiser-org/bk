import { Component, model, output } from '@angular/core';
import { AlbumConfig, newDefaultImageConfig, SectionFormModel, SectionProperties } from '@bk/models';
import { BkCatInputComponent, BkCheckComponent, BkTextInputComponent } from '@bk/ui';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { AlbumStyle, AlbumStyles, GalleryEffect, GalleryEffects } from '@bk/categories';
import { error } from '@bk/util';

@Component({
  selector: 'bk-album-config-form',
  standalone: true,
  imports: [
    IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    BkCatInputComponent, BkTextInputComponent, BkCheckComponent
  ],
  template: `
    @if(vm(); as vm) {
      <ion-row>
        <ion-col size="12"> 
          <ion-card>
            <ion-card-header>
              <ion-card-title>Album</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-grid>
                <ion-row>
                  <ion-col size="12">                                            <!-- album directory -->           
                    <bk-text-input name="directory" [value]="vm.properties!.album!.directory!" (changed)="onPropertyChanged('directory', $event)" [showHelper]=true />
                  </ion-col>
                  <ion-col size="12" size-md="6">                                <!-- albumStyle -->
                    <bk-cat-input name="albumStyle" [value]="vm.properties!.album!.albumStyle" [categories]="albumStyles" (changed)="onPropertyChanged('albumStyle', $event)" />
                  </ion-col>
                  <ion-col size="12" size-md="6">                              <!-- recursive -->          
                    <bk-check name="recursive" [isChecked]="vm.properties?.album?.recursive!" (changed)="onPropertyChanged('recursive', $event)" [showHelperText]="true" />
                  </ion-col>
                  <ion-col size="12" size-md="6">                              <!-- showVideos -->          
                    <bk-check name="showVideos" [isChecked]="vm.properties?.album?.showVideos!" (changed)="onPropertyChanged('showVideos', $event)" [showHelperText]="true" />
                  </ion-col>
                  <ion-col size="12" size-md="6">                              <!-- showStreamingVideos -->          
                    <bk-check name="showStreamingVideos" [isChecked]="vm.properties?.album?.showStreamingVideos!" (changed)="onPropertyChanged('showStreamingVideos', $event)" [showHelperText]="true" />
                  </ion-col>
                  <ion-col size="12" size-md="6">                              <!-- showDocs -->          
                    <bk-check name="showDocs" [isChecked]="vm.properties?.album?.showDocs!" (changed)="onPropertyChanged('showDocs', $event)" [showHelperText]="true" />
                  </ion-col>
                  <ion-col size="12" size-md="6">                              <!-- showPdfs -->          
                    <bk-check name="showPdfs" [isChecked]="vm.properties?.album?.showPdfs!" (changed)="onPropertyChanged('showPdfs', $event)" [showHelperText]="true" />
                  </ion-col>
                  <ion-col size="12" size-md="6">                                <!-- galleryEffect -->
                    <bk-cat-input name="galleryEffect" [value]="vm.properties!.album!.galleryEffect" [categories]="galleryEffects" (changed)="onPropertyChanged('galleryEffect', $event)" />
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    }
  `
})
export class AlbumFormComponent {
  public vm = model.required<SectionFormModel>();

  public changedProperties = output<SectionProperties>();
  protected albumStyles = AlbumStyles;
  protected galleryEffects = GalleryEffects;

  protected onPropertyChanged(fieldName: keyof AlbumConfig, value: string | boolean | number) {
    const _config = this.vm().properties?.album ?? {
      directory: '',
      albumStyle: AlbumStyle.Pinterest,
      defaultImageConfig: newDefaultImageConfig(),
      recursive: false,
      showVideos: false,
      showStreamingVideos: true,
      showDocs: false,
      showPdfs: true,
      galleryEffect: GalleryEffect.Slide
    };
    switch (fieldName) {
      case 'directory': _config.directory = value as string; break;
      case 'albumStyle': _config.albumStyle = value as number; break;
      case 'recursive': _config.recursive = value as boolean; break;
      case 'showVideos': _config.showVideos = value as boolean; break;
      case 'showStreamingVideos': _config.showStreamingVideos = value as boolean; break;
      case 'showDocs': _config.showDocs = value as boolean; break;
      case 'showPdfs': _config.showPdfs = value as boolean; break;
      case 'galleryEffect': _config.galleryEffect = value as number; break;
      default: error(undefined, `BkAlbumSectionForm.onAlbumPropertyChanged: unknown field ${fieldName}`); return;
    }
    const _properties = this.vm().properties;
    if (_properties) {
      _properties.album = _config;
    }
    this.changedProperties.emit({
      album: _config
    });
  }
}
