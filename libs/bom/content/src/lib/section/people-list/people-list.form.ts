import { Component, computed, input, output } from '@angular/core';
import { Avatar, SectionFormModel, SectionProperties } from '@bk/models';
import { BkCheckComponent, caseInsensitiveWordMask, BkTextInputComponent, BkNumberInputComponent, BkCatInputComponent } from '@bk/ui';
import { IonCol, IonLabel, IonRow } from '@ionic/angular/standalone';
import { BkEditorComponent } from '../article/bk-editor';
import { NameDisplays, ViewPositions } from '@bk/categories';
import { error, NameDisplay } from '@bk/util';
import { BkModelListComponent } from '@bk/base';

@Component({
  selector: 'bk-people-list-form',
  standalone: true,
  imports: [
    IonRow, IonCol, IonLabel,
    BkCatInputComponent, BkEditorComponent,
    BkModelListComponent, BkCheckComponent, BkTextInputComponent, BkNumberInputComponent
  ],
  template: `
    @if(vm(); as vm) {
      <ion-row>
        <ion-col size="12">                                              <!-- Avatar Konfiguration -->      
          <ion-label><strong>Personen</strong></ion-label>
        </ion-col>
        <ion-col size="12">                                                       <!-- list of persons -->
          <bk-model-list [vm]="vm" />
        </ion-col>
        <ion-col size="12">                                                  <!-- position of the person avatars -->
          <bk-cat-input name="imagePosition" [value]="vm.imagePosition!" [categories]="viewPositions" (changed)="updateImagePosition($event)" />                                                   
        </ion-col>
        <ion-col size="12">                                               <!-- content -->            
          <bk-editor [content]="vm.content ?? ''" [readOnly]="false" (contentChange)="onContentChange($event)" />
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12">                                              <!-- Avatar Konfiguration -->      
          <ion-label><strong>Avatar Konfiguration</strong></ion-label>
        </ion-col>
        <ion-col size="12">                                                               <!-- Avatar title -->
          <bk-text-input name="title" [value]="avatarConfig()?.title!" (changed)="onAvatarPropertyChanged('title', $event)" />
        </ion-col>
        <ion-col size="12">                                                               <!-- alt text -->
          <bk-text-input name="altText" [value]="avatarConfig()?.altText!" (changed)="onAvatarPropertyChanged('altText', $event)" [showHelper]=true />
        </ion-col>
        <ion-col size="12" size-md="6">                                           <!-- showName -->
          <bk-check name="showName" [isChecked]="avatarConfig()?.showName!" (changed)="onAvatarPropertyChanged('showName', $event)" />
        </ion-col>  
        <ion-col size="12" size-md="6">                                     <!-- showLabel -->
          <bk-check name="showLabel" [isChecked]="avatarConfig()?.showLabel!" (changed)="onAvatarPropertyChanged('showLabel', $event)" />
        </ion-col>  
        <ion-col size="12" size-md="6">                                        <!-- cols -->
          <bk-number-input name="cols" [value]="avatarConfig()?.cols!" (changed)="onAvatarPropertyChanged('cols', $event)" [showHelper]=true />
        </ion-col>  
        <ion-col size="12" size-md="6">                                        <!-- nameDisplay -->
          <bk-cat-input name="nameDisplay" [value]="avatarConfig()?.nameDisplay ?? nameDisplay.FirstLast" [categories]="nameDisplays" (changed)="onAvatarPropertyChanged('nameDisplay', $event)" />                                               
        </ion-col>  
        <ion-col size="12" size-md="6">                                        <!-- linkedSection -->
          <bk-text-input name="linkedSection" [value]="avatarConfig()?.linkedSection!" (changed)="onAvatarPropertyChanged('linkedSection', $event)" [showHelper]=true />                                               
        </ion-col> 
      </ion-row>
    }
  `
})
export class PeopleListFormComponent {
  public vm = input.required<SectionFormModel>();
  protected avatarConfig = computed(() => this.vm().properties?.avatar);

  public contentChange = output<string>();
  public positionChange = output<number>();
  public changedProperties = output<SectionProperties>();

  protected caseInsensitiveWordMask = caseInsensitiveWordMask;
  protected viewPositions = ViewPositions;

  protected nameDisplay = NameDisplay;
  protected nameDisplays = NameDisplays;

  protected updateImagePosition(position: number): void {
    this.positionChange.emit(position);
  }

  protected onContentChange(changedContent: string): void {
    this.contentChange.emit(changedContent);
  }


  protected onAvatarPropertyChanged(fieldName: keyof Avatar, value: string | boolean | number) {
    const _config = this.vm().properties?.avatar ?? {
      cols: 1,
      showName: true,
      showLabel: false,
      nameDisplay: NameDisplay.FirstLast,
      altText: 'avatar',
      title: 'Avatar',
      linkedSection: ''
    };
    switch (fieldName) {
      case 'cols': _config.cols = value as number; break;
      case 'showName': _config.showName = value as boolean; break;
      case 'showLabel': _config.showLabel = value as boolean; break;
      case 'nameDisplay': _config.nameDisplay = value as number; break;
      case 'altText': _config.altText = value as string; break;
      case 'title': _config.title = value as string; break;
      case 'linkedSection': _config.linkedSection = value as string; break;
      default: error(undefined, `BkPeopleListSectionFormComponent.onAvatarPropertyChanged: unknown field ${fieldName}`); return;
    }
    const _properties = this.vm().properties;
    if (_properties) {
      _properties.avatar = _config;
    }
    this.changedProperties.emit({
      avatar: _config
    });
  }
}
