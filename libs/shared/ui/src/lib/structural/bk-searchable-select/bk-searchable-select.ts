import { Component, OnChanges, SimpleChanges, input, model, output } from '@angular/core';
import { RandomUser } from '@bk/util';
import { BkCheckComponent } from '../../form/bk-check';
import { IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonItem, IonLabel, IonModal, IonSearchbar, IonTitle, IonToolbar, SearchbarCustomEvent } from '@ionic/angular/standalone';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bk-searchable-select',
  standalone: true,
  imports: [
    BkCheckComponent, 
    TranslatePipe, AsyncPipe,
    IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonSearchbar, IonContent, IonItem, IonCheckbox, IonLabel
  ],
  template: `
    @if (selected.length) {
      @for(item of selected; track item.username; let last = $last) {
        <span>{{ leaf(item) }}{{ last ? '' : ', '}}</span>
      }
    } @else {
      <ion-modal [isOpen]="isOpen()">
        <ng-template>
          <ion-header>
            @if (multiple()) {
              <ion-toolbar color="primary">
                <ion-buttons slot="start">
                  <ion-button (click)="cancel()">Cancel</ion-button>
                </ion-buttons>
                <ion-title>{{ title() | translate | async }}</ion-title>
                <ion-buttons slot="end">
                  <ion-button (click)="select()">Select</ion-button>
                </ion-buttons>
              </ion-toolbar>
            }
            <ion-toolbar>
              <ion-searchbar (ionChange)="filter($any($event))"></ion-searchbar>
            </ion-toolbar>
          </ion-header>
          <ion-content>
            @for(item of filtered; track item.username) {
              <ion-item>
                <bk-check name="item" [isChecked]="item.selected" (changed)="itemSelected(item)"></bk-check>
                <ion-checkbox
                  slot="start"
                  [checked]="item.selected"
                  (ionChange)="itemSelected(item)">
                </ion-checkbox>
                <ion-label>{{ leaf(item) }}</ion-label>
              </ion-item>
            }
          </ion-content>
        </ng-template>
      </ion-modal>
    }
  `,
  styles: ['ion-searchbar { padding-top: 12px; }']
})
export class BkSearchableSelectComponent implements OnChanges {
  public title = input('@general.operation.search.placeholder');
  public isOpen = model(false);
  public multiple = input(false);
  public data = input.required<RandomUser[]>();

  public itemTextField = input('name');
  public selectedChanged = output<RandomUser[]>();

  public selected: RandomUser[] = [];
  public filtered: RandomUser[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(_changes: SimpleChanges): void {
    this.filtered = this.data();
  }

  public open() {
    this.isOpen.set(true);
  }

  public select() {
    this.selectedChanged.emit(this.selected);
    this.isOpen.set(false);
  }

  public cancel() {
    this.isOpen.set(false);
  }

  public itemSelected(item: RandomUser) {
    item.selected = !item.selected;
    this.selected = this.data().filter((item) => item.selected);
    if (!this.multiple() && this.selected.length) {
      this.selectedChanged.emit(this.selected);
      this.isOpen.set(false);
    }
  }

  public filter(event: SearchbarCustomEvent) {
    const _filter = event.detail.value?.toLocaleLowerCase();
    this.filtered = this.data().filter(item => {
      return (this.leaf(item).toLowerCase().indexOf(_filter) >= 0)
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leaf = (obj: any) => this.itemTextField().split('.').reduce((value, el) => value[el], obj);
}
