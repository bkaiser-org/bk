import { AsyncPipe } from '@angular/common';
import { Component, inject, input, model } from '@angular/core';
import { AuthorizationService } from '@bk/base';
import { SectionFormModel } from '@bk/models';
import { TranslatePipe } from '@bk/pipes';
import { BkTextInputComponent, coordinateMask } from '@bk/ui';
import { IonCol, IonLabel, IonRow } from '@ionic/angular/standalone';

@Component({
  selector: 'bk-map-section-form',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    IonRow, IonCol, IonLabel,
    BkTextInputComponent
  ],
  template: `
    @if(vm(); as vm) {
      <ion-row>
        <ion-col size="12">
          <ion-label>{{ '@content.section.forms.map.title' | translate | async }}</ion-label>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12">
          <bk-text-input name="coordinates" [value]="vm.url!" (changed)="updateField($event)" [maxLength]=30 [mask]="coordMask" [showError]=true [readOnly]="readOnly()" />                                        
        </ion-col>
      </ion-row>
    }
  `
})
export class BkMapSectionFormComponent {
  public authorizationService = inject(AuthorizationService);

  public vm = model.required<SectionFormModel>();
  public readOnly = input(!this.authorizationService.hasRole('contentAdmin'));

  protected coordMask = coordinateMask;

  protected updateField(value: string) {
    this.vm.update((_vm) => ({..._vm, url: value}));
  }
} 