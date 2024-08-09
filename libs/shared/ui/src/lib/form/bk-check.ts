import { Component, OnInit, input, output, viewChild } from '@angular/core';
import { IonCheckbox, IonItem, IonNote } from '@ionic/angular/standalone';
import { CategoryPlainNamePipe, TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { ColorIonic, ColorsIonic } from '@bk/categories';

export type CheckboxLabelPlacement = 'start' | 'end' | 'fixed';
export type CheckboxJustification = 'start' | 'end' | 'space-between';

@Component({
  selector: 'bk-check',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, CategoryPlainNamePipe,
    IonItem, IonCheckbox, IonNote
  ],
  template: `
  <ion-item lines="none">
    <ion-checkbox #bkCheck required
        [name]="name()"
        [labelPlacement]="labelPlacement()"
        [justify]="justify()"
        [checked]="isChecked()"
        [disabled]="readOnly()" 
        [color]="color() | categoryPlainName:colorsIonic"
        [indeterminate]="indeterminate()"
        (ionChange)="onChange()">
        <div class="ion-text-wrap">
        {{ '@checkbox.' + name() + '.label' | translate | async }}
        </div>
    </ion-checkbox>
  </ion-item>
  @if(showHelperText()) {
    <ion-item lines="none">
      <ion-note>{{ '@checkbox.' + name() + '.helperText' | translate | async }}</ion-note>
    </ion-item>
  }
  `
})
export class BkCheckComponent implements OnInit {
  public name = input.required<string>();   // mandatory name of the form control
  public isChecked = input(false);    // initial value
  public readOnly = input(false);      // if true, the checkbox is read-only
  public color = input<ColorIonic>(ColorIonic.Secondary);
  public justify = input<'start'|'end'|'space-between'>('start');
  public showHelperText = input(false);
  public labelPlacement = input<'start'|'end'|'fixed'>('end'); // placement of the label
  public indeterminate = input(false); // if true, the checkbox can be in indeterminate state
  public ionCheckbox = viewChild.required('bkCheck');
  public changed = output<boolean>(); // event to notify the parent component about changes

  private checkState!: boolean;
  protected colorsIonic = ColorsIonic;

  ngOnInit(): void {
    this.checkState = this.isChecked();
  }

  private toggleCheck() {
    this.checkState = !this.checkState;
  }

  public onChange() {
//    const _checkbox = this.ionCheckbox() as IonCheckbox;
//    this.changed.emit(_checkbox.checked);
    this.toggleCheck();
    this.changed.emit(this.checkState);
  }
}
