import { Component, computed, model, output } from '@angular/core';
import { Button, Icon, SectionFormModel, SectionProperties } from '@bk/models';
import { BkCatInputComponent, BkNumberInputComponent, BkStringSelectComponent, BkTextInputComponent, BkUrlComponent, lowercaseWordMask, sizeMask } from '@bk/ui';
import { IonCol, IonItem, IonLabel, IonNote, IonRow, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { BkEditorComponent } from '../widgets/bk-editor';
import { ColorIonic, ColorsIonic, FileTypeIcon, ViewPositions } from '@bk/categories';
import { error, stripPostfix } from '@bk/util';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bk-button-section-form',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    IonRow, IonCol, IonLabel, IonSelect, IonSelectOption, IonNote, IonItem,
    BkUrlComponent, BkEditorComponent, BkCatInputComponent,
    BkTextInputComponent, BkNumberInputComponent, BkStringSelectComponent
  ],
  template: `
    @if(vm(); as vm) {
      <ion-row>
        <ion-col size="12">                                            <!-- url -->
          <bk-url [value]="vm.url ?? ''" (changed)="changedUrl.emit($event)" />
        </ion-col>
        <ion-col size="12">                                             <!-- image position -->
          <bk-cat-input name="imagePosition" [value]="vm.imagePosition!" [categories]="viewPositions" (changed)="updateImagePosition($event)" />
        </ion-col>
        <ion-col size="12">                                         <!-- content -->
          <bk-editor [content]="vm.content ?? '<p></p>'" [readOnly]="false" (contentChange)="onContentChange($event)" />
         </ion-col>
      </ion-row>
    }
  `
})
export class BkButtonSectionFormComponent {
  public vm = model.required<SectionFormModel>();

  protected iconName = computed(() => this.vm().properties?.icon?.name ?? 'download-outline');
  protected iconSize = computed(() => stripPostfix(this.vm().properties?.icon?.size ?? '40', 'px'));
  protected buttonWidth = computed(() => stripPostfix(this.vm().properties?.button?.width ?? '200', 'px'));
  protected buttonHeight = computed(() => stripPostfix(this.vm().properties?.button?.height ?? '60', 'px'));

  public contentChange = output<string>();
  public positionChange = output<number>();
  public changedUrl = output<string>();

  protected wordMask = lowercaseWordMask;
  protected sizeMask = sizeMask;
  protected isCallAction = true;
  protected colorsIonic = ColorsIonic;
  protected viewPositions = ViewPositions;
  protected extensionList = Object.values(FileTypeIcon);

  protected updateImagePosition(position: number): void {
    this.vm.update((_vm) => ({..._vm, imagePosition: position}));
    this.positionChange.emit(position);
  }

  protected onContentChange(changedContent: string): void {
    this.vm.update((_vm) => ({..._vm, content: changedContent}));
    this.contentChange.emit(changedContent);
  }

  public changedProperties = output<SectionProperties>();

  protected onButtonPropertyChanged(fieldName: keyof Button, value: string | boolean | number) {
    const _config = this.vm().properties?.button ?? {
      label: '',
      shape: 'round',
      fill: 'clear',
      width: '200',
      height: '60',
      color: ColorIonic.Primary,
    };
    switch (fieldName) {
      case 'label': _config.label = value as string; break;
      case 'shape': _config.shape = value as string; break;
      case 'fill': _config.fill = value as string; break;
      case 'width': _config.width = value as string + 'px'; break;
      case 'height': _config.height = value as string + 'px'; break;
      case 'color': _config.color = value as number; break;
      default: error(undefined, `BkButtonSectionForm.onButtonPropertyChanged: unknown field ${fieldName}`); return;
    }
    const _properties = this.vm().properties;
    if (_properties) {
      _properties.button = _config;
    }
    this.changedProperties.emit({
      button: _config
    });
  }

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
