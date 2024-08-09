import { Component, computed, model, output } from '@angular/core';
import { DefaultImageConfig, SectionFormModel, SectionProperties } from '@bk/models';
import { BkCheckComponent, BkNumberInputComponent, BkStringSelectComponent, BkTextInputComponent } from '@bk/ui';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonItem, IonRow } from '@ionic/angular/standalone';
import { error } from '@bk/util';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bk-image-config-form',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonGrid,
    BkCheckComponent, BkTextInputComponent, BkNumberInputComponent, BkStringSelectComponent
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
                    <bk-number-input name="width" [value]="imageConfig()?.width ?? defaultWidth" (changed)="onPropertyChanged('width', $event)" />
                  </ion-col>  
                  <ion-col size="12" size-md="6">                                        <!-- height -->
                    <bk-number-input name="height" [value]="imageConfig()?.height ?? defaultHeight" (changed)="onPropertyChanged('height', $event)" />
                  </ion-col>  
                  <ion-col size="12" size-md="6">                                        <!-- borderRadius -->
                    <bk-number-input name="borderRadius" [value]="imageConfig()?.borderRadius ?? defaultBorderRadius" (changed)="onPropertyChanged('borderRadius', $event)" [showHelper]=true />
                  </ion-col>  
                  <ion-col size="12" size-md="6">                            <!-- icon slot -->
                    <bk-string-select name="albumStyle"  [selectedString]="imageConfig()?.albumStyle ?? 'grid'"
                      [stringList] = "['grid', 'pinterest', 'imgix']" (changed)="onPropertyChanged('albumStyle', $event)" />           
                  </ion-col>
                  <ion-col size="12" size-md="6">                                     <!-- isZoomable -->
                    <bk-check name="isZoomable" [isChecked]="imageConfig()?.isZoomable ?? defaultIsZoomable" (changed)="onPropertyChanged('isZoomable', $event)" />
                  </ion-col>  
                  <ion-col size="12" size-md="6">                                        <!-- zoomFactor -->
                    <bk-number-input name="zoomFactor" [value]="imageConfig()?.zoomFactor ?? defaultZoomFactor" (changed)="onPropertyChanged('zoomFactor', $event)" [showHelper]=true />
                  </ion-col>  
                  <ion-col size="12" size-md="6">                                     <!-- isThumbnail -->
                    <bk-check name="isThumbnail" [isChecked]="imageConfig()?.isThumbnail ?? defaultIsThumbnail" (changed)="onPropertyChanged('isThumbnail', $event)" />
                  </ion-col>  
                  <ion-col size="12" size-md="6">                            <!-- icon slot -->
                    <bk-string-select name="slot"  [selectedString]="imageConfig()?.slot ?? defaultSlot"
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

  protected readonly defaultImgIxParams = '';
  protected readonly defaultWidth = 300;
  protected readonly defaultHeight = 200;
  protected readonly defaultBorderRadius = 10;
  protected readonly defaultIsZoomable = true;
  protected readonly defaultZoomFactor = 2;
  protected readonly defaultIsThumbnail = false;
  protected readonly defaultSlot: 'start' | 'end' | 'icon-only' = 'start';

  protected imageConfig = computed(() => this.vm().properties?.defaultImageConfig);
  protected imgIxParams = computed(() => this.vm().properties?.defaultImageConfig?.imgIxParams ?? this.defaultImgIxParams);
  protected width = computed(() => this.vm().properties?.defaultImageConfig?.width ?? this.defaultWidth);
  protected height = computed(() => this.vm().properties?.defaultImageConfig?.height ?? this.defaultHeight);
  protected borderRadius = computed(() => this.vm().properties?.defaultImageConfig?.borderRadius ?? this.defaultBorderRadius);
  protected isZoomable = computed(() => this.vm().properties?.defaultImageConfig?.isZoomable ?? this.defaultIsZoomable);
  protected zoomFactor = computed(() => this.vm().properties?.defaultImageConfig?.zoomFactor ?? this.defaultZoomFactor);
  protected isThumbnail = computed(() => this.vm().properties?.defaultImageConfig?.isThumbnail ?? this.defaultIsThumbnail);
  protected slot = computed(() => this.vm().properties?.defaultImageConfig?.slot ?? this.defaultSlot);

  public changedProperties = output<SectionProperties>();

  protected onPropertyChanged(fieldName: keyof DefaultImageConfig, value: string | boolean | number) {
    const _config = this.vm().properties?.defaultImageConfig ?? {
      imgIxParams: this.defaultImgIxParams,
      width: this.defaultWidth,
      height: this.defaultHeight,
      borderRadius: this.defaultBorderRadius,
      isZoomable: this.defaultIsZoomable,
      zoomFactor: this.defaultZoomFactor,
      isThumbnail: this.defaultIsThumbnail,
      slot: this.defaultSlot
    };
    switch (fieldName) {
      case 'imgIxParams': _config.imgIxParams = value as string; break;
      case 'width': _config.width = value as number; break;
      case 'height': _config.height = value as number; break;
      case 'borderRadius': _config.borderRadius = value as number; break;
      case 'isZoomable': _config.isZoomable = value as boolean; break;
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
