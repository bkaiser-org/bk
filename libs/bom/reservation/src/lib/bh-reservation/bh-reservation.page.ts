import { Component, OnInit, computed, inject } from '@angular/core';
import { RelationshipModel, ReservationFormModel, UserModel } from '@bk/models';
import { AlertController, IonContent, IonItem, IonLabel } from '@ionic/angular/standalone';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { BkChangeConfirmationComponent, BkHeaderComponent } from '@bk/ui';
import { CollectionNames, confirm, die, navigateByUrl } from '@bk/util';
import { ModelType, RelationshipType } from '@bk/categories';
import { firstValueFrom, map, Observable } from 'rxjs';
import { ResourceService } from '@bk/resource';
import { SubjectService } from '@bk/subject';
import { Router } from '@angular/router';
import { BhReservationFormComponent } from './bh-reservation.form';
import { ReservationService } from '../reservation.service';
import { BoatHouseKey } from '../boatHouse-reservations/boatHouse-reservations.service';
import { newReservation } from '../reservation.util';
import { convertFormToReservation, convertReservationToForm } from '../reservation-form.util';
import { AuthService } from '@bk/auth';
import { DataService } from '@bk/base';

@Component({
  selector: 'bk-boathouse-reservation-page',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, 
    BkChangeConfirmationComponent, BhReservationFormComponent, BkHeaderComponent,
    IonContent, IonLabel, IonItem
  ],
  styles: [`
    ion-card-content { padding: 0px; }
    ion-card { padding: 0px; margin: 0px; border: 0px; box-shadow: none !important;}
  `],
  template: `
      <bk-header title="{{ '@event.type.reservation.bh.title' | translate | async }}" />
      @if(formCanBeSaved) {
        <bk-change-confirmation [showCancel]="true" (okClicked)="save()" (cancelClicked)="cancel()" />
      } 
      <ion-content>
        <ion-item lines="none">
          <ion-label>{{ '@event.type.reservation.bh.subTitle' | translate | async }}</ion-label>
        </ion-item>
        <bk-bh-reservation-form [vm]="vm" (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)" (confirmationChanged)="onConfirmationChange($event)" />
      </ion-content>
  `
})
export class BkBoathouseReservationPageComponent implements OnInit {
  private alertController = inject(AlertController);
  private router = inject(Router);
  public authService = inject(AuthService);
  private reservationService = inject(ReservationService);
  private resourceService = inject(ResourceService);
  private subjectService = inject(SubjectService);
  private dataService = inject(DataService);

  private reservation!: RelationshipModel; 
  protected formCanBeSaved = false;
  protected isConfirmed = false;
  protected formStateOk = false;
  public currentForm: ReservationFormModel | undefined;
  public vm!: ReservationFormModel; // current view model for editing
  public MT = ModelType;
  public RT = RelationshipType;

  private firebaseUid = computed(() => this.authService.currentFirebaseUser()?.uid);

  async ngOnInit() {
    const _resource = await firstValueFrom(this.resourceService.readResource(BoatHouseKey));
    const _uid = this.firebaseUid();
    if (_uid) {
      const _user$ = this.dataService.readModel(CollectionNames.User, _uid) as Observable<UserModel>;
      const _personKey = await firstValueFrom(_user$.pipe(map((_user) => _user?.personKey)));
      const _booker = await firstValueFrom(this.subjectService.readSubject(_personKey));
      if (_booker) {
        this.reservation = newReservation(_resource, _booker);
        console.log(this.reservation);
        this.vm = convertReservationToForm(this.reservation);
        console.log(this.vm);
      }
    } else {
      die('BkBoathouseReservationPageComponent.ngOnInit: _uid is undefined.');
    }
  }

  public onDataChange(form: ReservationFormModel): void {
    this.currentForm = form;
  }

  public onFormStateChange(formStateOk: boolean): void {
    this.formStateOk = formStateOk;
    this.formCanBeSaved = this.formStateOk && this.isConfirmed;
  }

  public onConfirmationChange(confirmed: boolean): void {
    this.isConfirmed = confirmed;
    this.formCanBeSaved = this.formStateOk && this.isConfirmed;
  }

  public async save() {
    if (!this.currentForm) this.cancel();

    const _reservation = convertFormToReservation(this.reservation, this.currentForm);
    const _key = await this.reservationService.saveNewReservation(_reservation);
    await this.reservationService.saveComment(CollectionNames.Reservation, _key, '@comment.operation.initial.conf');
    confirm(this.alertController, '@event.type.reservation.bh.confirmation', false);
    await navigateByUrl(this.router, '/reservation/all');
  }


  public async cancel(): Promise<void> {
    this.vm = convertReservationToForm(this.reservation);
    this.currentForm = this.vm;
    this.formStateOk = false;
    this.formCanBeSaved = this.formStateOk && this.isConfirmed;
  }
}
