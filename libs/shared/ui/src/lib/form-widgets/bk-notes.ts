import { AsyncPipe } from '@angular/common';
import { Component, inject, input, model, output } from '@angular/core';
import { SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { bkTranslate, decrypt, DESCRIPTION_LENGTH, encrypt } from '@bk/util';
import { AlertController, IonCol, IonGrid, IonIcon, IonItem, IonRow, IonTextarea } from '@ionic/angular/standalone';
import { BkCopyButtonComponent } from '../form/bk-copy-button';

@Component({
  selector: 'bk-notes',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, SvgIconPipe,
    IonGrid, IonRow, IonCol, IonTextarea, IonItem, IonIcon,
    BkCopyButtonComponent
  ],
  template: `
  <ion-grid>
      <ion-row>
        <ion-col size="12">
          <ion-textarea #bkNotes [name]="name()" [value]="value()" (ionInput)="onTextChange($event)"
            labelPlacement="floating"
            label="{{'@input.' + name() + '.label' | translate | async }}"
            placeholder="{{'@input.' + name() + '.placeholder' | translate | async }}"
            inputMode="text"
            type="text"
            fill="outline"
            [counter]="!readOnly()"
            [autoGrow]="true"
            [maxlength]="maxLength()"
            [rows]="rows()"
            [readonly]="readOnly()"
          />
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12">
          @if (clearable()) {
            <ion-icon src="{{'close-outline' | svgIcon }}" (click)="clearValue()" />
          }
          @if (copyable()) {
            <bk-copy-button [value]="value()" />
          }
          @if (encryptable()) {
            <ion-icon src="{{'key-outline' | svgIcon }}" (click)="dencrypt()" />
          }
        </ion-col>
      </ion-row>
  </ion-grid>
  `
})
export class BkNotesComponent {
  private alertController = inject(AlertController);

  public value = model.required<string>(); // mandatory view model
  public name = input('notes'); // name of the input field
  public readOnly = input(false); // if true, the input field is read-only
  public maxLength = input(DESCRIPTION_LENGTH); // max number of characters allowed
  public rows = input(5); // number of rows

  protected clearable = input(true); // show a button to clear the notes
  protected copyable = input(true); // show a button to copy the notes
  protected encryptable = input(true); // show a button to encrypt or decrypt the notes

  public changed = output<string>();
  private password = '';

  public clearValue(): void {
    this.value.update(() => '');
    this.changed.emit('');
  }

  /**
    * Signal the updated text value to the container element after each keystroke (onInput)
    * and after leaving the edit field (onChange)
    */
  protected onTextChange(event: CustomEvent): void {
    this.changed.emit(event.detail.value);
  }  

  public async dencrypt(): Promise<void> {
    if (!this.password || this.password.length === 0) {
      const _alert = await this.alertController.create({
        header: 'Passwort eingeben',
        message: 'Achtung: wenn du das Passwort vergisst, kann der Text nicht mehr entschlüsselt werden !',
        inputs: [{
          name: 'PasswordPrompt',
          type: 'text',
          placeholder: 'Passwort'
        }],
        buttons: [{
          text: bkTranslate('@general.operation.change.cancel'),
          role: 'cancel'
        }, {
          text: bkTranslate('@general.operation.change.ok'),
          handler: (_data) => {
            this.password = _data['PasswordPrompt'];
            this.dencryptWithPassword(this.password);
          }
        }]
      });
      await _alert.present();
    } else { // we already have a password
      this.dencryptWithPassword(this.password);
    }
  }

  private async dencryptWithPassword(password: string) {
    let _value = this.value();
    if (_value.startsWith('**')) { // text is encrypted -> decrypt it
      _value = await decrypt(_value.substring(2), password);
    }  else {  // text is plain -> encrypt it
      _value = '**' + await encrypt(_value, password);
    } 
    this.value.update(() => _value);
    this.changed.emit(_value);
  }
}
