import { Component, computed, model, output } from '@angular/core';
import { Icon, SectionFormModel, SectionProperties } from '@bk/models';
import { BkStringSelectComponent, BkTextInputComponent, sizeMask } from '@bk/ui';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { FileTypeIcon } from '@bk/categories';
import { error, stripPostfix } from '@bk/util';

@Component({
  selector: 'bk-icon-config-form',
  standalone: true,
  imports: [
    IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    BkTextInputComponent, BkStringSelectComponent
  ],
  template: `
    @if(vm(); as vm) {
      <ion-row>
        <ion-col size="12"> 
          <ion-card>
            <ion-card-header>
              <ion-card-title>Icon</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-grid>
                <ion-row>
                  <ion-col size="12" size-md="6">                            <!-- select icon name type: ion-icon or file-type -->
                    <bk-string-select name="callAction"  [showHelper]=true selectedString="call"
                      [stringList] = "['call', 'download']"  (changed)="isCallAction = ($event === 'call')" />
                  </ion-col>
                  <ion-col size="12" size-md="6">                            <!-- icon name -->
                    @if(isCallAction === true) {
                      <bk-text-input name="icon" [value]="iconName()" (changed)="onIconPropertyChanged('name', $event)" [showHelper]=true />
                    } @else {
                      <bk-string-select name="extension"  [selectedString]="iconName()"
                      [stringList] = "extensionList" (changed)="onIconPropertyChanged('name', $event)" />
                    }
                  </ion-col>
                  <ion-col size="12" size-md="6">                            <!-- icon size -->
                    <bk-text-input name="iconSize" [value]="iconSize()" (changed)="onIconPropertyChanged('size', $event)" [mask]="sizeMask" [maxLength]=3 [showHelper]=true [showError]=true />                                        
                  </ion-col>
                  <ion-col size="12" size-md="6">                            <!-- icon slot -->
                    <bk-string-select name="slot"  [selectedString]="vm.properties!.icon!.slot ?? 'start'"
                      [stringList] = "['start', 'end', 'icon-only']" (changed)="onIconPropertyChanged('slot', $event)" />           
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
export class IconConfigFormComponent {
  public vm = model.required<SectionFormModel>();
  protected iconName = computed(() => this.vm().properties?.icon?.name ?? 'download-outline');
  protected iconSize = computed(() => stripPostfix(this.vm().properties?.icon?.size ?? '40', 'px'));

  protected sizeMask = sizeMask;
  protected isCallAction = true;
  protected extensionList = Object.values(FileTypeIcon);

  public changedProperties = output<SectionProperties>();

  protected onIconPropertyChanged(fieldName: keyof Icon, value: string | boolean | number) {
    const _config = this.vm().properties?.icon ?? {
      name: 'pdf',
      size: '40',
      slot: 'icon-only'
    };
    switch (fieldName) {
      case 'name': _config.name = value as string; break;
      case 'size': _config.size = value as string + 'px'; break;
      case 'slot': _config.slot = value as 'start'|'end'|'icon-only'; break;
      default: error(undefined, `BkButtonSectionForm.onIconPropertyChanged: unknown field ${fieldName}`); return;
    }
    const _properties = this.vm().properties;
    if (_properties) {
      _properties.icon = _config;
    }
    this.changedProperties.emit({
      icon: _config
    });
  }
}
