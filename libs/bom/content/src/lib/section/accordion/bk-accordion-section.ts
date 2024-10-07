import { CUSTOM_ELEMENTS_SCHEMA, Component, forwardRef, input } from '@angular/core';
import { SectionModel } from '@bk/models';
import { IonAccordion, IonAccordionGroup, IonCol, IonGrid, IonItem, IonLabel, IonRow } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { CategoryPlainNamePipe, TranslatePipe } from '@bk/pipes';
import { ColorsIonic } from '@bk/categories';
import { BkSectionComponent } from '../bk-section';

@Component({
  selector: 'bk-accordion-section',
  standalone: true,
  imports: [
    AsyncPipe, TranslatePipe, CategoryPlainNamePipe,
    IonGrid, IonRow, IonCol, IonLabel,
    IonAccordionGroup, IonAccordion, IonItem, IonLabel,
    forwardRef(() => BkSectionComponent)
  ],
  schemas: [ 
    CUSTOM_ELEMENTS_SCHEMA
  ],
  template: `
    @if(section(); as section) {
      <ion-accordion-group [value]="section.name">
        @for(sectionDesc of section.properties.accordion?.sections; track sectionDesc) {
          <ion-accordion [value]="sectionDesc.value" toggle-icon-slot="start" >
            <ion-item slot="header" [color]="section.color | categoryPlainName:colorsIonic">
              <ion-label>{{sectionDesc.label | translate | async}}</ion-label>
            </ion-item>
            <div slot="content">
              <bk-section [sectionKey]="sectionDesc.key" [readOnly]="readOnly()"/>
            </div>
          </ion-accordion>
        }
      </ion-accordion-group>
    }
  `
})
export class BkAccordionSectionComponent {
  public section = input<SectionModel>();
  public readOnly = input(true);

  colorsIonic = ColorsIonic;
}