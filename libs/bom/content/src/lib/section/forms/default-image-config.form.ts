import { Component, computed, model, output } from '@angular/core';
import { DefaultImageConfig, newDefaultImageConfig, SectionFormModel, SectionProperties } from '@bk/models';
import { BkCatInputComponent, BkCheckComponent, BkNumberInputComponent, BkStringSelectComponent, BkTextInputComponent } from '@bk/ui';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonItem, IonRow } from '@ionic/angular/standalone';
import { error } from '@bk/util';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { ImageActions } from '@bk/categories';

@Component({
  selector: 'bk-image-config-form',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonGrid,
    BkCheckComponent, BkTextInputComponent, BkNumberInputComponent, BkStringSelectComponent, BkCatInputComponent
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
              <ion-grid>
                <ion-row>
                  <ion-col size="12">                            <!-- imgIxParams -->           
                    <bk-text-input name="imgIxParams" [value]="imageConfig()?.imgIxParams ?? ''" (changed)="onPropertyChanged('imgIxParams', $event)" [showHelper]=true />
                  </ion-col>
                  <ion-col size="12" size-md="6">                                        <!-- width -->
                    <bk-number-input name="width" [value]="imageConfig()?.width ?? defaultImageConfig.width" (changed)="onPropertyChanged('width', $event)" />
                  </ion-col>  
                  <ion-col size="12" size-md="6">                                        <!-- height -->
                    <bk-number-input name="height" [value]="imageConfig()?.height ?? defaultImageConfig.height" (changed)="onPropertyChanged('height', $event)" />
                  </ion-col>  
                  <ion-col size="12" size-md="6">                                        <!-- borderRadius -->
                    <bk-number-input name="borderRadius" [value]="imageConfig()?.borderRadius ?? defaultImageConfig.borderRadius" (changed)="onPropertyChanged('borderRadius', $event)" [showHelper]=true />
                  </ion-col>  
                  <ion-col size="12" size-md="6">                                     <!-- imageAction -->
                      <bk-cat-input name="imageAction" [value]="imageAction()" [categories]="imageActions" (changed)="onPropertyChanged('imageAction', $event)" />
                  </ion-col>  
                  <ion-col size="12" size-md="6">                                        <!-- zoomFactor -->
                    <bk-number-input name="zoomFactor" [value]="imageConfig()?.zoomFactor ?? defaultImageConfig.zoomFactor" (changed)="onPropertyChanged('zoomFactor', $event)" [showHelper]=true />
                  </ion-col>  
                  <ion-col size="12" size-md="6">                                     <!-- isThumbnail -->
                    <bk-check name="isThumbnail" [isChecked]="imageConfig()?.isThumbnail ?? defaultImageConfig.isThumbnail" (changed)="onPropertyChanged('isThumbnail', $event)" />
                  </ion-col>  
                  <ion-col size="12" size-md="6">                            <!-- icon slot -->
                    <bk-string-select name="slot"  [selectedString]="imageConfig()?.slot ?? defaultImageConfig.slot"
                      [stringList] = "['start', 'end', 'icon-only']" (changed)="onPropertyChanged('slot', $event)" />           
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
export class BkImageConfigFormComponent {
  public vm = model.required<SectionFormModel>();
  protected defaultImageConfig = newDefaultImageConfig();

  protected imageConfig = computed(() => this.vm().properties?.defaultImageConfig);
  protected imgIxParams = computed(() => this.vm().properties?.defaultImageConfig?.imgIxParams ?? this.defaultImageConfig.imgIxParams);
  protected width = computed(() => this.vm().properties?.defaultImageConfig?.width ?? this.defaultImageConfig.width);
  protected height = computed(() => this.vm().properties?.defaultImageConfig?.height ?? this.defaultImageConfig.height);
  protected borderRadius = computed(() => this.vm().properties?.defaultImageConfig?.borderRadius ?? this.defaultImageConfig.borderRadius);
  protected imageAction = computed(() => this.vm().properties?.defaultImageConfig?.imageAction ?? this.defaultImageConfig.imageAction);
  protected zoomFactor = computed(() => this.vm().properties?.defaultImageConfig?.zoomFactor ?? this.defaultImageConfig.zoomFactor);
  protected isThumbnail = computed(() => this.vm().properties?.defaultImageConfig?.isThumbnail ?? this.defaultImageConfig.isThumbnail);
  protected slot = computed(() => this.vm().properties?.defaultImageConfig?.slot ?? this.defaultImageConfig.slot);

  public changedProperties = output<SectionProperties>();

  protected imageActions = ImageActions;

  protected onPropertyChanged(fieldName: keyof DefaultImageConfig, value: string | boolean | number) {
    const _config = this.vm().properties?.defaultImageConfig ?? this.defaultImageConfig;
    switch (fieldName) {
      case 'imgIxParams': _config.imgIxParams = value as string; break;
      case 'width': _config.width = value as number; break;
      case 'height': _config.height = value as number; break;
      case 'sizes': _config.sizes = value as string; break;
      case 'borderRadius': _config.borderRadius = value as number; break;
      case 'imageAction': _config.imageAction = value as number; break;
      case 'zoomFactor': _config.zoomFactor = value as number; break;
      case 'isThumbnail': _config.isThumbnail = value as boolean; break;
      case 'slot': _config.slot = value as 'start' | 'end' | 'icon-only'; break;
      default: error(undefined, `BkImageConfigSectionForm.onPropertyChanged: unknown field ${fieldName}`); return;
    }
    const _properties = this.vm().properties;
    if (_properties) {
      _properties.defaultImageConfig = _config;
    }
    this.changedProperties.emit({
      defaultImageConfig: _config
    });
  }
}
