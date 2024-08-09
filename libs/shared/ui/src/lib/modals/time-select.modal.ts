import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@bk/pipes';
import { DatetimeChangeEventDetail, IonContent, IonDatetime, ModalController } from '@ionic/angular/standalone';
import { BkHeaderComponent } from '../structural/bk-header';
import { ConfigService } from '@bk/util';

@Component({
  selector: 'bk-time-select-modal',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, 
    BkHeaderComponent,
    IonContent, IonDatetime
  ],
  template: `
      <bk-header title="{{ title() | translate | async }}" [isModal]="true" />
      <ion-content class="ion-padding">
        <ion-datetime 
            [value]="time()"
            [locale]="configService.getConfigString('i18n_locale')"
            presentation="time"
            [showDefaultButtons]="true"
            doneText="{{'@general.operation.change.ok' | translate | async}}"
            cancelText="{{'@general.operation.change.cancel' | translate | async}}"
            (ionChange)="onTimeSelected($event.detail)" />
      </ion-content>
  `,
})
export class BkTimeSelectModalComponent {
  private modalController = inject(ModalController);
  protected configService = inject(ConfigService);

  public time = input.required<string>();
  public title = input('@general.operation.select.time');

  /**
   * 
   * @param detail 
   * @returns string | string[] | undefined | null
   */
  protected async onTimeSelected(detail: DatetimeChangeEventDetail): Promise<boolean> {
    return await this.modalController.dismiss(detail.value, 'confirm');
  }

  protected async cancel(): Promise<boolean> {
    return await this.modalController.dismiss(null, 'cancel');
  }
}
