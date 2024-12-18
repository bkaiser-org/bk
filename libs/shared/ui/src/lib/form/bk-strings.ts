import { Component, input, model, output } from '@angular/core';
import { SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonNote, IonReorder, IonReorderGroup, ItemReorderEventDetail } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { arrayMove } from '@bk/util';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { FormsModule } from '@angular/forms';
import { MaskitoDirective } from '@maskito/angular';
import { lowercaseWordMask } from '../form-widgets/bk-text-input';

@Component({
  selector: 'bk-strings',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, SvgIconPipe,
    FormsModule, MaskitoDirective,
    IonList, IonListHeader, IonItem,
    IonLabel, IonInput, IonIcon, IonNote,
    IonReorderGroup, IonReorder,
    IonCard, IonCardHeader, IonCardContent, IonCardTitle
  ],
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ title() | translate | async }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-item lines="none">
          @if((description() ?? '').length > 0) {
            <ion-note>{{ description() | translate | async }}</ion-note>
          }
        </ion-item>
        <ion-item lines="none">
          <ion-input [(ngModel)]="newString" (ionChange)="save()"
              label="{{ addLabel() | translate | async }}"
              labelPlacement="floating"
              inputMode="text"
              type="text"
              [counter]="true"
              [maxlength]="maxLength()"
              placeholder="ssssss"
              [maskito]="mask()"
              [maskitoElement]="maskPredicate" />
        </ion-item>

        @if(strings(); as strings) {
          <ion-list>
            <!-- Casting $event to $any is a temporary fix for this bug https://github.com/ionic-team/ionic-framework/issues/24245 -->
            <ion-reorder-group  [disabled]="false" (ionItemReorder)="reorder($any($event))">
              @for(word of strings; track word) {
                <ion-item>
                  <ion-reorder slot="start" />
                  <ion-label>{{ word }}</ion-label>
                  <ion-icon src="{{'close-circle-outline' | svgIcon }}" (click)="removeWord(word)" slot="end" />
                </ion-item>
              }
            </ion-reorder-group>
          </ion-list>
        }
      </ion-card-content>
    </ion-card>
  `
})
export class BkStringsComponent {
  public strings = model.required<string[]>(); // the keys of the menu items
  public title = input('@input.strings.label');
  public addLabel = input('@input.strings.addString');
  public description = input<string>();
  public mask = input<MaskitoOptions>(lowercaseWordMask);
  public maxLength = input(20);

  public newString = '';
  public stringsChanged = output<string[]>();

  public save(): void {
    if (this.newString && this.newString.length > 0) {
      this.strings().push(this.newString);
      this.newString = '';
      this.stringsChanged.emit(this.strings());
    }
  }

  public removeWord(word: string): void {
    this.strings().splice(this.strings().indexOf(word), 1);
    this.stringsChanged.emit(this.strings());
  }

  reorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    arrayMove(this.strings(), ev.detail.from, ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
    this.stringsChanged.emit(this.strings());
  }

  readonly maskPredicate: MaskitoElementPredicate = async (el: HTMLElement) => (el as HTMLIonInputElement).getInputElement();
}

