import { Component, inject } from '@angular/core';
import { ModelType } from '@bk/categories';
import { IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { AuthorizationService } from './authorization.service';
import { getModelAdmin } from './authorization.util';
import { AuthService } from '@bk/auth';
import { isOnline$ } from '@bk/util';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'bk-auth-info',
  standalone: true,
  providers: [AuthorizationService],
  imports: [
    AsyncPipe,
    IonGrid, IonRow, IonCol
  ],
  template: `
    <ion-grid>
      <ion-row>
        <ion-col>System:</ion-col>
      </ion-row>
      <ion-row>
        <ion-col><small>online status:</small></ion-col>
        <ion-col><small>{{ online$ | async }}</small></ion-col>
      </ion-row>
      <ion-row>
        <ion-col>Authorization:</ion-col>
      </ion-row>
      <ion-row>
        <ion-col><small>isAuthenticated:</small></ion-col>
        <ion-col><small>{{ authService.isAuthenticated() }}</small></ion-col>
      </ion-row>
      <ion-row>
        <ion-col><small>FirebaseUser.loginEmail:</small></ion-col>
        <ion-col><small>{{ authService.currentFirebaseUser()?.email }}</small></ion-col>
      </ion-row>
      <ion-row>
        <ion-col><small>FirebaseUser.uid:</small></ion-col>
        <ion-col><small>{{ authService.currentFirebaseUser()?.uid }}</small></ion-col>
      </ion-row>

      <ion-row>
        <ion-col><small>CurrentUser.loginEmail:</small></ion-col>
        <ion-col><small>{{ authorizationService.currentUser()?.loginEmail }}</small></ion-col>
      </ion-row>
      <ion-row>
        <ion-col><small>CurrentUser.personKey:</small></ion-col>
        <ion-col><small>{{ authorizationService.currentUser()?.personKey }}</small></ion-col>
      </ion-row>
      <ion-row>
        <ion-col><small>CurrentUser.personName:</small></ion-col>
        <ion-col><small>{{ authorizationService.currentUser()?.personName }}</small></ion-col>
      </ion-row>
      <ion-row>
        <ion-col><small>CurrentUser.roles:</small></ion-col>
        <ion-col><small>{{ printRoles() }}</small></ion-col>
      </ion-row>
      <ion-row>
        <ion-col><small>CurrentUser.tenant:</small></ion-col>
        <ion-col><small>{{ authorizationService.currentUser()?.tenant }}</small></ion-col>
      </ion-row>
      <ion-row>
        <ion-col><small>isAdmin</small></ion-col>
        <ion-col><small>{{ authorizationService.isAdmin() }}</small></ion-col>
      </ion-row>
      <ion-row>
        <ion-col><small>canEdit(Subject)</small></ion-col>
        <ion-col><small>{{ canEdit(MT.Subject) }}</small></ion-col>
      </ion-row>
      <ion-row>
        <ion-col><small>canEdit(Resource)</small></ion-col>
        <ion-col><small>{{ canEdit(MT.Resource) }}</small></ion-col>
      </ion-row>
      <ion-row>
        <ion-col><small>canEdit(Page)</small></ion-col>
        <ion-col><small>{{ canEdit(MT.Page) }}</small></ion-col>
      </ion-row>
  </ion-grid>
  `
})
export class AuthInfoComponent {
  public authorizationService = inject(AuthorizationService);
  public authService = inject(AuthService);

  public MT = ModelType;
  public online$ = isOnline$.pipe(map(online => online ? 'online' : 'offline'));

  public canEdit(modelType: ModelType): boolean {
    return this.authorizationService.checkAuthorization(getModelAdmin(modelType));
  }

  public printRoles(): string {
    const roles = this.authorizationService.currentUser()?.roles;
    return (JSON.stringify(roles));
  }
}
