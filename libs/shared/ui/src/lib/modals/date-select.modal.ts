import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@bk/pipes';
import { DatetimeChangeEventDetail, IonContent, IonDatetime, ModalController } from '@ionic/angular/standalone';
import { BkHeaderComponent } from '../structural/bk-header';
import { ENV } from '@bk/util';

@Component({
  selector: 'bk-date-select-modal',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, 
    BkHeaderComponent,
    IonContent, IonDatetime
  ],
  template: `
      <bk-header title="{{ header() | translate | async }}" [isModal]="true" />
      <ion-content class="ion-padding">
        <ion-datetime 
            min="1900-01-01" max="2025-12-31"
            [value]="isoDate()"
            [locale]="locale"
            [firstDayOfWeek]="1"
            presentation="date"
            [showDefaultButtons]="true"
            doneText="{{'@general.operation.change.ok' | translate | async}}"
            cancelText="{{'@general.operation.change.cancel' | translate | async}}"
            (ionChange)="onDateSelected($event.detail)" />
      </ion-content>
  `,
})
export class BkDateSelectModalComponent {
  private readonly modalController = inject(ModalController);
  protected env = inject(ENV);

  // tbd: switching to input signals leads to error: not a function
  // see: https://github.com/ionic-team/ionic-framework/issues/28876
  // see: https://github.com/ionic-team/ionic-framework/pull/29453 
  // should be fixed with Ionic 8.1.1 or 8.2 and is backwards-incompatible:  useSetInputAPI: true,
  public isoDate = input.required<string>();
  public header = input('@general.operation.select.date');
  protected locale = this.env.i18n.locale;

  /**
   * 
   * @param detail 
   * @returns string | string[] | undefined | null
   */
  protected async onDateSelected(detail: DatetimeChangeEventDetail): Promise<boolean> {
    return await this.modalController.dismiss(detail.value, 'confirm');
  }

  protected async cancel(): Promise<boolean> {
    return await this.modalController.dismiss(null, 'cancel');
  }
}
