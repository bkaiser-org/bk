import { Component, DestroyRef, OnInit, inject, input } from '@angular/core';
import { BaseModel } from '@bk/models';
import { CategoryNamePipe, LogoPipe, TranslatePipe } from '@bk/pipes';
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonModal, IonRow, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { NameByModelPipe } from '../models/name-by-model.pipe';
import { BkAvatarLabelComponent, BkHeaderComponent, BkSearchbarComponent, BkSpinnerComponent } from '@bk/ui';
import { AsyncPipe } from '@angular/common';
import { ListType, SectionTypes, getCollectionNameFromModelType } from '@bk/categories';
import { DataService } from '../models/data.service';
import { tagMatches } from '@bk/util';
import { SearchableComponent } from './searchable-component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Modal to select form a list of models.
 * Model is derived from the listType that is a mandatory input parameter -> ModelSelectListType
 * The modal is triggered with 'select-model'.
 */
@Component({
  selector: 'bk-model-select-modal',
  standalone: true,
  imports: [ 
    TranslatePipe, LogoPipe, NameByModelPipe, AsyncPipe, CategoryNamePipe,
    BkSearchbarComponent, BkAvatarLabelComponent, BkSpinnerComponent, BkHeaderComponent,
    IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonGrid, IonRow, IonCol,
    IonButtons, IonButton, IonIcon, IonLabel
  ],
  template: `
    <bk-header title="{{ title() | translate | async }}" [isModal]="true" [isSearchable]="true" (ionInput)="onSearchtermChange($event)"/>
    <ion-content>
      @if (filteredItems()) {
          <ion-grid>
            @for(item of filteredItems(); track item.bkey) {
              <ion-row (click)="select(item)">
                <ion-col size="12">
                    <bk-avatar-label key="{{item.modelType + '.' + item.bkey}}" label="{{ item | nameByModel}}" />
                </ion-col>
              </ion-row>
            }
          </ion-grid>
      } @else {
        <bk-spinner />
      }
    </ion-content>
  `
})
export class BkModelSelectComponent extends SearchableComponent implements OnInit {
  private dataService = inject(DataService);
  private modalController = inject(ModalController);
  protected destroyRef = inject(DestroyRef); // takeUntilDestroyed must be used inside an injection context.

  public bkListType = input.required<ListType>();

  protected sectionTypes = SectionTypes;

  ngOnInit() {
   this.initialize();
  }

  protected initialize() {
    this.listType$.next(this.bkListType());
    this.dataService.searchData(
      getCollectionNameFromModelType(this.modelType()), 
      this.initialQuery(), 
      this.orderBy() ?? 'name',
      this.sortOrder() ?? 'asc'
    )
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((_items) => {
      if (this.listType() === ListType.OrgSelectable) {
        this.groupedItems$.next(_items.filter((_model) => tagMatches(_model.tags, 'selectable')));
      } else {
        this.groupedItems$.next(_items);
      }
    });
  }

  public cancel(): Promise<boolean> {
    return this.modalController.dismiss(null, 'cancel');
  }

  public async select(model: BaseModel): Promise<void> {
    await this.modalController.dismiss(model, 'confirm');
  }
}



