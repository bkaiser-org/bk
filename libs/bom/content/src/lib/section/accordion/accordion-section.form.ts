import { Component, model, output } from '@angular/core';
import { ColorsIonic } from '@bk/categories';
import { Accordion, SectionFormModel, SectionProperties } from '@bk/models';
import { BkCatInputComponent, BkCheckComponent, BkTextInputComponent } from '@bk/ui';
import { error } from '@bk/util';
import { IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';

@Component({
  selector: 'bk-accordion-section-form',
  standalone: true,
  imports: [
    IonGrid, IonRow, IonCol,
    BkCatInputComponent, BkCheckComponent, BkTextInputComponent
  ],
  template: `
    @if(vm(); as vm) {
      <ion-row>
        <ion-col size="12">
          <ion-grid>
            <ion-row>
              <ion-col size="12" size-md="6">                                <!-- color -->
                <bk-cat-input name="color" [value]="vm.color!" [categories]="colorsIonic" (changed)="updateColor($event)" />
              </ion-col>
              <ion-col size="12" size-md="6">                               <!-- name -->         
                <bk-text-input name="name" [value]="vm.name ?? ''" (changed)="onPropertyChanged('value', $event)" [autofocus]="true" [maxLength]=30 [showError]=true [showHelper]=true />                                        
              </ion-col>
              <ion-col size="12" size-md="6">                              <!-- multiple -->          
                <bk-check name="isMultiple" [isChecked]="vm.properties?.accordion?.multiple!" (changed)="onPropertyChanged('multiple', $event)" [showHelperText]="true" />
              </ion-col>
              <ion-col size="12" size-md="6">                                     <!-- readonly -->
                <bk-check name="isReadOnly" [isChecked]="vm.properties?.accordion?.readonly!" (changed)="onPropertyChanged('readonly', $event)" [showHelperText]="true" />
              </ion-col>
              <ion-col size="12">                                                     <!-- sections -->
                <div>tbd: sections = [ key, label, value]</div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-col>
      </ion-row>
    }
  `
})
export class AccordionSectionFormComponent {
  public vm = model.required<SectionFormModel>();
  public changedProperties = output<SectionProperties>();
  public changedColor = output<number>();
  protected colorsIonic = ColorsIonic;

  protected updateColor(color: number): void {
    this.vm.update((_vm) => ({..._vm, color: color}));
    this.changedColor.emit(color);
  }

  protected onPropertyChanged(fieldName: keyof Accordion, value: string | boolean) {
    const _accordion = this.vm().properties?.accordion ?? {
      value: '',
      multiple: false,
      readonly: false,
      sections: []
    };
    switch (fieldName) {
      case 'multiple': _accordion.multiple = value as boolean; break;
      case 'readonly': _accordion.readonly = value as boolean; break;
      case 'value': _accordion.value = value as string; break;
      // tbd: case 'sections': _accordion.sections = value as AccordionSectionDesc[]; break;
      default: error(undefined, `AccordionSectionFormComponent.onPropertyChanged: unknown field ${fieldName}`); return;
    }
    const _properties = this.vm().properties;
    if (_properties) {
      _properties.accordion = _accordion;
    }
    this.changedProperties.emit({
      accordion: _accordion
    });
  }
} 