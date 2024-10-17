import { Component, inject, input, output } from '@angular/core';
import { SectionModel } from '@bk/models';
import { CategoryNamePipe, LogoPipe, TranslatePipe } from '@bk/pipes';
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonLabel, IonReorder, IonReorderGroup, IonRow, ItemReorderEventDetail, ModalController } from '@ionic/angular/standalone';
import { BkHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { AsyncPipe } from '@angular/common';
import { SectionTypes } from '@bk/categories';
import { arrayMove } from '@bk/util';

/**
 * Modal to select form a list of models.
 * Model is derived from the listType that is a mandatory input parameter -> ModelSelectListType
 * The modal is triggered with 'select-model'.
 */
@Component({
  selector: 'bk-sort-sections-modal',
  standalone: true,
  imports: [ 
    TranslatePipe, LogoPipe, AsyncPipe, CategoryNamePipe,
    BkSpinnerComponent, BkHeaderComponent,
    IonContent, IonReorderGroup, IonReorder, IonItem, IonGrid, IonRow, IonCol,
    IonButtons, IonButton, IonIcon, IonLabel
  ],
  template: `
    <bk-header title="Sektionen sortieren" [isModal]="true" [showOkButton]="true" (okClicked)="save()" />
    <ion-content>
      @if (sections(); as sections) {
        <!-- Casting $event to $any is a temporary fix for this bug https://github.com/ionic-team/ionic-framework/issues/24245 -->
        <ion-reorder-group disabled="false" (ionItemReorder)="reorder($any($event))">
          @for(section of sections; track section.bkey) {
            <ion-item>              
              {{ section.name}}  ({{ section.category | categoryName:STS }})
              <ion-reorder slot="start" />
            </ion-item>
          }
        </ion-reorder-group>
      } @else {
        <bk-spinner />
      }
    </ion-content>
  `
})
export class BkSortSectionsComponent {
  private modalController = inject(ModalController);
  public sections = input.required<SectionModel[]>();
  protected STS = SectionTypes;
  public sectionsChanged = output<SectionModel[]>();

  public cancel(): Promise<boolean> {
    return this.modalController.dismiss(null, 'cancel');
  }

  public save(): Promise<boolean> {
    return this.modalController.dismiss(this.sections(), 'confirm');
  }

  reorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    arrayMove(this.sections(), ev.detail.from, ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
    this.sectionsChanged.emit(this.sections());
  }
}



