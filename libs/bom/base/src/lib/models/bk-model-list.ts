import { AsyncPipe } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { SectionFormModel, SubjectModel, isPerson } from '@bk/models';
import { FullNamePipe, SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { AlertController, IonAvatar, IonButton, IonIcon, IonImg, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, ModalController } from '@ionic/angular/standalone';
import { ListType, ModelType } from '@bk/categories';
import { bkPrompt } from '@bk/util';
import { AvatarPipe, BkSpinnerComponent } from '@bk/ui';
import { BkModelSelectComponent } from '../model-select.modal/model-select.modal';

@Component({
  selector: 'bk-model-list',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, AvatarPipe, FullNamePipe, SvgIconPipe,
    FormsModule, 
    IonItemSliding, IonList, IonLabel, IonButton, IonAvatar, IonImg,
    IonItemOptions, IonItemOption, IonIcon, IonItem,
    BkSpinnerComponent
  ],
  styles: [`
    ion-list { width: 100%; }
  `],
  template: `
  <ion-button (click)="addPerson()" fill="clear">
    <ion-icon slot="icon-only" src="{{ 'add-circle-outline' | svgIcon }}" />{{ '@subject.person.operation.add.label' | translate | async }}
  </ion-button>
  @if(vm().properties; as properties) {
    <ion-list>
      @for(subject of properties.personList; track subject.bkey; let i = $index) {
        <ion-item-sliding #slidingItem>
          <ion-item lines="none">
            <ion-avatar slot="start">
              <ion-img [src]="MT.Person + '.' + subject.bkey | avatar | async" />
            </ion-avatar>
            <ion-label>{{subject.firstName | fullName:subject.lastName}} ({{subject.label}})</ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" (click)="removePerson(slidingItem, i)"><ion-icon slot="icon-only" src="{{'trash-outline' | svgIcon }}" /></ion-item-option>
            <ion-item-option color="light" (click)="editPerson(slidingItem, i)"><ion-icon slot="icon-only" src="{{'create-outline' | svgIcon }}" /></ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      }
    </ion-list>
  } @else {
    <bk-spinner />
  }
  
  `,
  /* 
   * BIG TROUBLE WITHOUT THIS VIEWPROVIDER
   * See Kara's talk: https://youtu.be/CD_t3m2WMM8?t=1826
   * COMMENT OUT to see:
   * - NgForm has no controls! Controls are detached from the form.
   * - Form-level status values (touched, valid, etc.) no longer change
   * - Controls still validate, update model, and update their statuses
   */
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class BkModelListComponent {
  private alertController = inject(AlertController);
  private modalController = inject(ModalController);

  public vm = model.required<SectionFormModel>(); // mandatory view model

  public MT = ModelType;

  public async addPerson(): Promise<void> {
    const _properties = this.vm().properties
    if (!_properties) {
      return;
    } else if (!_properties.personList) {
        _properties.personList = [];
    }
    const _person = await this.selectPerson();
    if (_person?.bkey && _properties?.personList) {
      _properties.personList.push({ bkey: _person.bkey, label: '', firstName: _person.firstName, lastName: _person.name});
    }
  }

  public async selectPerson(): Promise<SubjectModel | undefined> {
    const _modal = await this.modalController.create({
      component: BkModelSelectComponent,
      componentProps: {
        bkListType: ListType.PersonAll
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      return isPerson(data) ? data : undefined;
    }
    return undefined;
  }

  public async editPerson(slidingItem: IonItemSliding, index: number): Promise<void> {
    if (slidingItem) slidingItem.close();
    const _label = await bkPrompt(this.alertController, '@content.type.peopleList.labelField.label', '@content.type.peopleList.labelField.placeholder');
    const _persons = this.vm().properties?.personList;
    if (_label && _persons) {
      _persons[index].label = _label;
    }
  }

  public removePerson(slidingItem: IonItemSliding, index: number): void {
    if (slidingItem) slidingItem.close();
    const _persons = this.vm().properties?.personList;
    if (_persons) {
      _persons.splice(index, 1);
    }
  }
}
