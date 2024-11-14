import { Component, inject, model, output, signal } from '@angular/core';
import { BkEmailComponent, BkPasswordInputComponent } from '@bk/ui';
import { AuthCredentials, authCredentialsShape, authCredentialsValidations } from '@bk/models';
import { IonCol, IonGrid, IonRow, ModalController } from '@ionic/angular/standalone';
import { vestForms } from 'ngx-vest-forms';
import { ENV } from '@bk/util';

@Component({
  selector: 'bk-login-form',
  standalone: true,
  imports: [
    vestForms,
    BkEmailComponent, BkPasswordInputComponent,
    IonGrid, IonRow, IonCol
],
  template: `
    @if(vm(); as vm) {
      <form scVestForm
        [formShape]="shape"
        [formValue]="formValue()"
        [suite]="suite" 
        (formValueChange)="formValue.set($event)">

        <ion-grid>
          <ion-row>
            <ion-col size="12">                                     <!-- email -->
              <bk-email [value]="vm.email!" name="loginEmail" (changed)="updateField('email', $event)" (committed)="setFocusOnPasswordField = true" [showError]=true [showHelper]=true />
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="12">                                               <!-- password -->
              <bk-password-input [setFocus]="setFocusOnPasswordField" [value]="vm.password!" (changed)="updateField('password', $event)" />
            </ion-col>
          </ion-row>
        </ion-grid>
      </form>
    }
`
})
export class LoginFormComponent {
  protected env = inject(ENV);

  protected modalController = inject(ModalController);
  public vm = model<AuthCredentials>({ email: '', password: '' });

  public readonly suite = authCredentialsValidations;
  protected readonly formValue = signal<AuthCredentials>({});
  protected readonly shape = authCredentialsShape;
  protected readonly errors = signal<Record<string, string>>({ });
  
  protected readonly formValid = signal<boolean>(false);
  protected readonly formDirty = signal<boolean>(false);
  public changedData = output<AuthCredentials>();
  public changedFormState = output<boolean>();
  protected errorMessage = output<string>();
  protected setFocusOnPasswordField = false;

  protected updateField(fieldName: keyof AuthCredentials, value: string): void {
    this.vm.update((_vm) => ({..._vm, [fieldName]: value}));
    this.checkFormValidity();
  }

  private checkFormValidity(): void {
    this.formDirty.set(true);
    const _result = this.suite(this.vm());
    if (_result.hasErrors()) {
      let _errorMessage = _result.errors[0].message;
      if (_errorMessage && _errorMessage.length > 0) {
        _errorMessage = `@validation.${_errorMessage}`;
        // print out more information to find the exact validation error
        if (this.env.production === false) {
          console.log(this.vm());
          console.log(_result);
        }
      }
      console.warn(_errorMessage);
      this.errorMessage.emit(_errorMessage ?? '');
      this.formValid.set(false);
    } else {
      this.errorMessage.emit('');
      this.formValid.set(true);
    }
    this.notifyState();
  }

  protected notifyState(): void {
    this.changedFormState.emit(this.formValid() && this.formDirty());
    this.changedData.emit(this.vm());
  }
}