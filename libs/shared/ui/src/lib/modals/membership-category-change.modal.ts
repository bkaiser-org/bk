import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject, input } from '@angular/core';
import { SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { IonContent, IonIcon, IonInput, IonItem, IonLabel, ModalController } from '@ionic/angular/standalone';
import { BkHeaderComponent } from '../structural/bk-header';
import { Category, CategoryConfig, MemberTypes, OrgKey, ScsMemberTypes } from '@bk/categories';
import { DateFormat, convertDateFormatToString, getTodayStr } from '@bk/util';
import { BkCatComponent } from '../category/bk-cat/bk-cat';
import { FormsModule } from '@angular/forms';
import { BkDateSelectModalComponent } from './date-select.modal';
import { BkChangeConfirmationComponent } from '../form/bk-change-confirmation';
import { RelationshipModel } from '@bk/models';

@Component({
  selector: 'bk-membership-category-change-modal',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, FormsModule, SvgIconPipe,
    BkHeaderComponent, BkCatComponent, BkChangeConfirmationComponent,
    IonContent, IonInput, IonItem, IonIcon, IonLabel
  ],
  template: `
    <bk-header title="{{ title() | translate | async}}" [isModal]="true" />
    @if(dataCanBeSaved) {
        <bk-change-confirmation (okClicked)="save()" />
    } 
    <ion-content class="ion-padding">
      <ion-item lines="none">
        <ion-label>{{membership().subjectName2}} {{membership().subjectName}}</ion-label>
      </ion-item>
      <ion-icon src="{{'list-outline' | svgIcon }}" slot="start" />
      <bk-cat [config]="config!" [readOnly]="false" (ionChange)="onCategoryChange($event)" />

      <ion-item lines="none">
        <ion-icon src="{{'calendar-outline' | svgIcon }}" slot="start" (click)="selectDate()" />

        <ion-input name="dateOfChange" [ngModel]="isoDate"
          label="{{ label() | translate | async }}"
          labelPlacement="floating"
          inputMode="text"
          type="datetime-local"
          [counter]="!readOnly()"
          [maxlength]="10"
          placeholder="{{ placeholder() | translate | async }}"
          autocomplete="off"
          [clearInput]="true"
          (ionChange)="dateChanged($event)"
          [readonly]="readOnly()" />
      </ion-item>
    </ion-content>
  `,
})
export class MembershipCategoryChangeModalComponent implements OnInit {
  private modalController = inject(ModalController);

  public membership = input.required<RelationshipModel>();
  public selectedDate = input(getTodayStr());
  public title = input('@membership.operation.catChange.chooseNew');
  public placeholder = input('@input.validFrom.placeholder');
  public label = input('@input.validFrom.label');
  public readOnly = input(false);

  protected config: CategoryConfig | undefined;
  protected dataCanBeSaved = false;
  protected isoDate = '';
  protected selectedCategoryId: number | undefined;
  
  ngOnInit(): void {
    this.config = this.membership().objectKey === OrgKey.SCS ? {
      label: '@categories.listType.member.scs.all.categoryLabel',
      categories: ScsMemberTypes,
      selectedCategoryId: this.membership().subType
    } : {
      label: '@categories.listType.member.srv.all.categoryLabel',
      categories: MemberTypes,
      selectedCategoryId: this.membership().subType
    }
    this.selectedCategoryId = this.config.selectedCategoryId;
    this.isoDate = convertDateFormatToString(this.selectedDate(), DateFormat.StoreDate, DateFormat.IsoDate, false);
  }

  public async cancel(): Promise<boolean> {
    return await this.modalController.dismiss(undefined, 'cancel');
  }

  public async save(): Promise<boolean> {
    const _isoDate = convertDateFormatToString(this.isoDate, DateFormat.IsoDate, DateFormat.StoreDate);
    return await this.modalController.dismiss(this.selectedCategoryId + '.' + _isoDate, 'confirm');
  }

  protected onCategoryChange($event: Event): void {
    const _category = ($event.target as HTMLInputElement).value as unknown as Category;
    this.selectedCategoryId = _category.id;
    this.dataCanBeSaved = this.canDataBeSaved();
  }

  public dateChanged(event: CustomEvent) {
    this.isoDate = event.detail.value;
    this.dataCanBeSaved = this.canDataBeSaved();
  }

  protected async selectDate(): Promise<void> {
    const _modal = await this.modalController.create({
      component: BkDateSelectModalComponent,
      cssClass: 'date-modal',
      componentProps: {
        isoDate: this.isoDate
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      if (typeof(data) === 'string') {
        this.isoDate = data;
        this.dataCanBeSaved = this.canDataBeSaved();
      } else {
        console.error('MembershipCategoryChangeModalComponent.selectDate: type of returned data is not string: ', data);
      }
    }
  }

  private canDataBeSaved(): boolean {
    if (this.isoDate && this.selectedCategoryId !== undefined) {
      return true;
    } else {
      return false;
    }
  }
}
