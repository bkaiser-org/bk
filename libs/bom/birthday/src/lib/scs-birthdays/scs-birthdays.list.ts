import { Component, OnInit, inject } from '@angular/core';
import { BkAvatarLabelComponent, BkHeaderComponent, BkSearchbarComponent, BkSpinnerComponent } from '@bk/ui';
import { FormsModule } from '@angular/forms';
import { FullNamePipe, PrettyDatePipe, TranslatePipe } from '@bk/pipes';
import { IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonMenuButton, IonRow, IonSearchbar, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { AuthorizationService } from '@bk/base';
import { AppNavigationService } from '@bk/util';
import { ScsBirthdaysService } from './scs-birthdays.service';

@Component({
  selector: 'bk-scs-birthday-list',
  standalone: true,
  imports: [
    FormsModule,
    BkSearchbarComponent, BkAvatarLabelComponent, BkSpinnerComponent, BkHeaderComponent,
    TranslatePipe, FullNamePipe, PrettyDatePipe, AsyncPipe,
    IonToolbar, IonHeader, IonContent, IonTitle, IonButtons, IonMenuButton,
    IonGrid, IonRow, IonCol, IonItem, IonLabel, IonSearchbar
  ],
  template: `
  <ion-header>
    <ion-toolbar color="secondary" id="bkheader">
      <ion-buttons slot="start"><ion-menu-button /></ion-buttons>
      <ion-title>{{ '@subject.person.birthday.plural' | translate | async }}</ion-title>
    </ion-toolbar>
    <ion-toolbar>
      <ion-grid>
        <ion-row class="ion-align-items-center">
          <ion-col class="ion-no-padding">
            <bk-searchbar placeholder="{{ '@general.operation.search.placeholder' | translate | async  }}" (ionInput)="birthdayService.onSearchtermChange($event)"></bk-searchbar>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-toolbar>
    <ion-toolbar color="primary">
        <ion-grid>
            <ion-row>
                <ion-col size-xs="8" size-md="6"><strong>{{ '@subject.person.birthday.field.name' | translate | async  }}</strong></ion-col>
                <ion-col size="4" class="ion-hide-md-down"><strong>{{ '@subject.person.birthday.field.dateOfBirth' | translate | async  }}</strong></ion-col>
                <ion-col size-xs="4" size-md="2"><strong>{{ '@subject.person.birthday.field.days' | translate | async  }}</strong></ion-col>
            </ion-row>
        </ion-grid>
    </ion-toolbar>
  </ion-header>
  <ion-content #content>
    <ion-grid>
      @for (person of (birthdayService.birthdays$ | async); track person.bkey) {
        <ion-row>
          <ion-col size-xs="8" size-md="6"  (click)="edit(person.bkey)">
            <bk-avatar-label key="{{ '0.' + person.bkey }}" label="{{person.firstName | fullName:person.lastName}}" />
          </ion-col>
          <ion-col size="4" class="ion-hide-md-down">
            @if(authorizationService.hasRole('privileged')) {
              <ion-item lines="none">
                <ion-label>{{ person.dateOfBirth | prettyDate }}</ion-label>
              </ion-item>
            } @else {
              <ion-item lines="none">
                <ion-label>{{ person.dateOfBirth | prettyDate:true }}</ion-label>
              </ion-item>  
            }
          </ion-col>
          <ion-col size-xs="4" size-md="2">
              <ion-item lines="none"><ion-label>{{ person.inDays }}</ion-label></ion-item>
          </ion-col>
        </ion-row>
      }
    </ion-grid>
  </ion-content>
  `
})
export class ScsBirthdayListComponent implements OnInit {
  public birthdayService = inject(ScsBirthdaysService);
  public authorizationService = inject(AuthorizationService);
  private appNavigationService = inject(AppNavigationService);

  ngOnInit() {
    this.birthdayService.initialize();
  }

  public async edit(key: string): Promise<void> {
    this.appNavigationService.pushLink('/membership/scsBirthdays');
    await this.birthdayService.navigateToUrl(`/person/${key}`);
  }
}

