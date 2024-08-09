import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DataService } from "@bk/base";
import { createUserFromSubject } from "@bk/subject";
import { UserService } from "@bk/user";
import { AuthService } from "@bk/auth";
import { ModelType } from "@bk/categories";
import { SubjectModel } from "@bk/models";
import { TranslatePipe } from "@bk/pipes";
import { BkButtonComponent, BkHeaderComponent } from "@bk/ui";
import { CollectionNames, die } from "@bk/util";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonRow } from "@ionic/angular/standalone";
import { firstValueFrom } from "rxjs";

@Component({
    selector: 'bk-roles',
    standalone: true,
    imports: [
      TranslatePipe, AsyncPipe,
      FormsModule, 
      BkButtonComponent, BkHeaderComponent,
      IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, 
      IonGrid, IonRow, IonCol
    ],
    template: `
    <bk-header title="{{ '@aoc.title' | translate | async }}" />
  <ion-content>
    <ion-card>
        <ion-card-header>
          <ion-card-title>{{ '@aoc.roles.title' | translate | async }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col>{{ '@aoc.roles.content' | translate | async }}</ion-col>
            </ion-row>
            </ion-grid>
        </ion-card-content>
    </ion-card>
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ '@aoc.account.title' | translate | async  }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-grid>
          <ion-row>
            <ion-col>{{ '@aoc.account.content' | translate | async  }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">{{ '@aoc.account.input' | translate | async  }}</ion-col>
            <ion-col size="6"><input type="text" [(ngModel)]="personKey" /></ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6"></ion-col>
            <ion-col size="6">
              <bk-button 
              label="{{ '@aoc.account.button' | translate | async  }}"
              iconName="checkmark-circle-outline" (click)="createAccountAndUser()">
            </bk-button>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6"></ion-col>
            <ion-col size="6">
              <bk-button 
              label="{{ '@aoc.password.set' | translate | async  }}"
              iconName="checkmark-circle-outline" (click)="setPassword()">
            </bk-button>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6"></ion-col>
            <ion-col size="6">
              <bk-button 
              label="{{ '@aoc.password.reset' | translate | async  }}"
              iconName="checkmark-circle-outline" (click)="resetPassword()">
            </bk-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-card-content>
    </ion-card>
  </ion-content>
    `
})
export class RolesPageComponent {
    private userService = inject(UserService);
    // we use dataService directly, because we do not want to interfere with the state management of the subject service.
    private dataService = inject(DataService);
    private authService = inject(AuthService);
    public personKey: string | undefined;
    public authId: string | undefined;

    /**
     * Create a new Firebase user account for the given subject (person) if it does not yet exist.
     * Create a new user account for the same user to link the Firebase account with the subject.
     */
    public async createAccountAndUser(): Promise<void> {
        if (!this.personKey || this.personKey.length === 0) { 
          die('RolesPageComponent.createAccountAndUser: personKey is mandatory.');
        } else {
          try {
            const _subject = await firstValueFrom(this.dataService.readModel(CollectionNames.Subject, this.personKey)) as SubjectModel;
            if (!_subject) {
                console.error('RolesPageComponent.createAccountAndUser: subject ' + this.personKey + ' not found');
            } else {
                console.log('RolesPageComponent.createAccountAndUser: found ' + _subject.name + '/' + _subject.bkey + '/' + _subject.fav_email);
                if (_subject.modelType !== ModelType.Person) {
                    console.error('RolesPageComponent.createAccountAndUser: accounts can only be created for persons.');
                } else {
                    const _user = createUserFromSubject(_subject);
                    await this.userService.createUserAndAccount(_user);
                }
            }
            this.personKey = '';    
          }
          catch(_ex) {
              console.error(_ex);
          }
        }
    }

    /**
     * Set the password for the user account to a given value.
     * This is only possible if the user account has been created before.
     * This is a sensitive operation and should be avoided (as the admin then knows the user's password).
     */
    public async setPassword(): Promise<void> {
      if (!this.personKey || this.personKey.length === 0) { 
        die('RolesPageComponent.setPassword: personKey is mandatory.');
      } else {
        try {
          const _user = await firstValueFrom(this.userService.readByPersonKey(this.personKey));
          if (!_user || _user.length === 0) {
              console.error('RolesPageComponent.setPassword: user not found for person ' + this.personKey);
          } else if (_user.length > 1) {
              console.log('RolesPageComponent.setPassword: found ' + _user.length + ' users for person ' + this.personKey);
          } else {  // we have exactly one user
console.log('RolesPageComponent.setPassword: this is not yet implemented as it needs a cloud function');
/*
           see: https://stackoverflow.com/questions/29889729/how-to-get-the-email-of-any-user-in-firebase-based-on-user-id
           1) Implement cloud functions with admin SDK:
              admin.auth().getUser(uid)
              admin.auth().getUserByEmail(email)
              admin.auth().getUserByPhoneNumber(phoneNumber) 

              admin.auth().getUser(data.uid)
                .then(userRecord => resolve(userRecord.toJSON().email))
                .catch(error => reject({status: 'error', code: 500, error}))

           2) Call the cloud function from the client
*/
          }
        }
        catch(_ex) {
            console.error(_ex);
        }
      }
    }

    public async resetPassword(): Promise<void> {
      if (!this.personKey || this.personKey.length === 0) { 
        die('RolesPageComponent.resetPassword: personKey is mandatory.');
      } else {
        try {
          const _user = await firstValueFrom(this.userService.readByPersonKey(this.personKey));
          if (!_user || _user.length === 0) {
              console.error('RolesPageComponent.resetPassword: user not found for person ' + this.personKey);
          } else if (_user.length > 1) {
              console.log('RolesPageComponent.resetPassword: found ' + _user.length + ' users for person ' + this.personKey);
          } else {  // we have exactly one user
            const _email = _user[0].loginEmail;
            console.log('RolesPageComponent.resetPassword: sending reset password email to  ' + _email);
            this.authService.resetPassword(_email);
          }
        }
        catch(_ex) {
            console.error(_ex);
        }
      }
    }
}
