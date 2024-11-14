import { Component, inject } from '@angular/core';
import { BkHeaderComponent } from '@bk/ui';
import { AuthCredentials } from '@bk/models';
import { IonButton, IonContent, IonItem, ModalController } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@bk/pipes';
import { AuthService } from './auth.service';
import { LoginFormComponent } from './login.form';

@Component({
  selector: 'bk-login-modal',
  standalone: true,
  imports: [
    BkHeaderComponent, LoginFormComponent,
    TranslatePipe, AsyncPipe,
    IonContent, IonButton, IonItem
  ],
  template: `
    <bk-header title="{{ '@auth.operation.login.title' | translate | async }}" [isModal]="true" />
    <ion-content>
      <bk-login-form (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)" />
      <ion-item lines="none">
        <ion-button slot="start" fill="clear" (click)="cancel()">{{ '@general.operation.change.cancel' | translate | async }}</ion-button>
        <ion-button slot="end" fill="clear" [disabled]="!formCanBeSaved" (click)="login()">{{ '@auth.operation.login.title' | translate | async}}</ion-button>
      </ion-item>
    </ion-content>
  `
})
export class LoginModalComponent {
  private readonly modalController = inject(ModalController);
  private readonly authService = inject(AuthService);

  protected formCanBeSaved = false;
  public currentCredentials: AuthCredentials | undefined;

  public onDataChange(form: AuthCredentials): void {
    this.currentCredentials = form;
  }

  public onFormStateChange(formCanBeSaved: boolean): void {
    this.formCanBeSaved = formCanBeSaved;
  }

  public async login(): Promise<void> {
    await this.modalController.dismiss(this.currentCredentials, 'cancel');
    if (this.currentCredentials?.email && this.currentCredentials?.password) {
      this.authService.login(this.currentCredentials.email, this.currentCredentials.password);
    }
  }

  public async cancel(): Promise<void> {
    await this.modalController.dismiss(undefined, 'cancel');
  }
}
