import { Component } from '@angular/core';
import { IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonRow } from '@ionic/angular/standalone';
import { BkHeaderComponent } from '@bk/ui';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { ConfigService } from '@bk/util';
import { inject } from '@angular/core';

@Component({
  selector: 'bk-impressum',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, 
    BkHeaderComponent, 
    IonContent, IonCard, IonCardContent, IonGrid, IonRow, IonCol
  ],
  template: `
  <bk-header title="{{ '@cms.impressum.title' | translate | async }}" />
<ion-content>
    <ion-card>
        <ion-card-content>
            <ion-grid>
                <ion-row>
                    <ion-col size="3">{{ '@cms.impressum.operator.title' | translate | async }}</ion-col>
                    <ion-col>
                        {{operatorName}}<br />
                        {{operatorStreet}}<br />
                        {{operatorZip}} {{operatorCity}}<br />
                        <a href="mailto:{{ operatorEmail }}">{{ operatorEmail }}</a>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="3">{{ '@cms.impressum.operator.id' | translate | async }}</ion-col>
                    <ion-col>{{ operatorUid }}</ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="3">{{ '@cms.impressum.operator.vat' | translate | async }}</ion-col>
                    <ion-col>{{ operatorMwst }}</ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="3">{{ '@cms.impressum.editor.title' | translate | async }}</ion-col>
                    <ion-col><div [innerHtml]="'@cms.impressum.editor.description' | translate | async"></div></ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="3">{{ '@cms.impressum.coding.title' | translate | async }}</ion-col>
                    <ion-col>Bruno Kaiser</ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="3">{{ '@cms.impressum.photograph.title' | translate | async }}</ion-col>
                    <ion-col>{{ '@cms.impressum.photograph.description' | translate | async }}</ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="3">{{ '@cms.impressum.help.title' | translate | async }}</ion-col>
                    <ion-col>Barbara Kaiser</ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="3">{{ '@cms.impressum.copyright.title' | translate | async }}</ion-col>
                    <ion-col><div [innerHtml]="'@cms.impressum.copyright.description' | translate | async"></div></ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="3">{{ '@cms.impressum.liability.title' | translate | async }}</ion-col>
                    <ion-col><div [innerHtml]="'@cms.impressum.liability.description' | translate | async"></div></ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="3">{{ '@cms.impressum.privacy.title' | translate | async }}</ion-col>
                    <ion-col><div [innerHtml]="'@cms.impressum.privacy.description' | translate | async"></div></ion-col>
                </ion-row>
            </ion-grid>
        </ion-card-content>
    </ion-card>
</ion-content>
  `
})
export class ImpressumPageComponent {
  private configService = inject(ConfigService);

  public operatorName = this.configService.getConfigString('operator_name');
  public operatorStreet = this.configService.getConfigString('operator_street');
  public operatorZip = this.configService.getConfigString('operator_zipcode');
  public operatorCity = this.configService.getConfigString('operator_city');
  public operatorEmail = this.configService.getConfigString('operator_email');
  public operatorUid = this.configService.getConfigString('operator_uid');
  public operatorMwst = this.operatorUid + ' MWST';
}
