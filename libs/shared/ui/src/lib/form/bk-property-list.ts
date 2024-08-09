
import { Component, input, model, output } from '@angular/core';
import { TranslatePipe } from '@bk/pipes';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonReorder, IonReorderGroup, ItemReorderEventDetail } from '@ionic/angular/standalone';
import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { BaseProperty, arrayMove, getIndexOfKey } from '@bk/util';
import { FormsModule } from '@angular/forms';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { MaskitoDirective } from '@maskito/angular';

@Component({
  selector: 'bk-property-list',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, KeyValuePipe,
    FormsModule, MaskitoDirective,
    IonList, IonListHeader, IonItem, IonButton,
    IonLabel, IonInput, IonIcon,
    IonReorderGroup, IonReorder,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent
  ],
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ title() | translate | async }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-item lines="none">
          <ion-input [(ngModel)]="newProperty.key"
            label="key"
            labelPlacement="floating"
            inputMode="text"
            type="text"
            [counter]="true"
            [maxlength]="20"
            placeholder="ssssss"
            [maskito]="wordMask"
            [maskitoElement]="maskPredicate" />
          <ion-input [(ngModel)]="newProperty.value"
            label="value"
            labelPlacement="floating"
            inputMode="text"
            type="text"
            [counter]="true"
            [maxlength]="50"
            placeholder="string | number | boolean"/>
            <!-- tbd: input the type of the value; default: string -->
          <ion-button [disabled]="isDisabled()" (click)="add()">Add</ion-button>
        </ion-item>

        @if(propertyList(); as propertyList) {
          <ion-list>
            <!-- Casting $event to $any is a temporary fix for this bug https://github.com/ionic-team/ionic-framework/issues/24245 -->
            <ion-reorder-group  [disabled]="false" (ionItemReorder)="reorder($any($event))">
              @for(property of propertyList; track property.key) {
                <ion-item>
                  <ion-reorder slot="start" />
                  <ion-label>{{ property.key }}</ion-label>
                  <ion-label>{{ property.value }}</ion-label>
                  <ion-icon name="close-circle-outline" (click)="remove(property.key)" slot="end" />
                </ion-item>
              }
            </ion-reorder-group>
          </ion-list>
        }
      </ion-card-content>
    </ion-card>
  `
})
export class BkPropertyListComponent {
  public propertyList = model.required<BaseProperty[]>(); // the keys of the menu items
  public title = input('@input.property.label');
  public propertiesChanged = output<void>();
  
  protected newProperty: BaseProperty = { key: '', value: '' };

  protected isDisabled() {
    return this.newProperty['key'] === '' || this.newProperty['value'] === '';
  }

  protected add(): void {
    if (this.newProperty.key.length > 0 && this.propertyList()) {
      this.propertyList().push(this.newProperty);
      this.newProperty = { key: '', value: '' };
      this.propertiesChanged.emit();
    }
  }

  protected remove(propertyKey: string): void {
    this.propertyList().splice(getIndexOfKey(this.propertyList(), propertyKey), 1);
    this.propertiesChanged.emit();
  }

  protected reorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    arrayMove(this.propertyList(), ev.detail.from, ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
    this.propertiesChanged.emit();
  }

  readonly wordMask: MaskitoOptions = {
    mask: /^[a-z0-9-_]+$/,
  };
  readonly maskPredicate: MaskitoElementPredicate = async (el: HTMLElement) => (el as HTMLIonInputElement).getInputElement();
}

