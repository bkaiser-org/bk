import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DocumentService } from "@bk/document";
import { TranslatePipe } from "@bk/pipes";
import { BkButtonComponent, BkHeaderComponent } from "@bk/ui";
import { ConfigService, copyToClipboard, showToast } from "@bk/util";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCheckbox, IonCol, IonContent, IonGrid, IonIcon, IonRow, ToastController } from "@ionic/angular/standalone";

@Component({
    selector: 'bk-firebase-storage',
    standalone: true,
    styles: [`
      input { width: 100%;}
    `],
    imports: [
      TranslatePipe, AsyncPipe,
      FormsModule, 
      BkButtonComponent, BkHeaderComponent,
      IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, 
      IonGrid, IonRow, IonCol, IonIcon, IonCheckbox
    ],
    template: `
    <bk-header title="{{ '@aoc.title' | translate | async }}" />
  <ion-content>
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ '@aoc.storage-info.title' | translate | async  }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-grid>
          <ion-row>
            <ion-col>{{ '@aoc.storage-info.content' | translate | async  }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="10"><input type="text" [(ngModel)]="path" /></ion-col>
            <ion-col size="1"><ion-icon name="copy-outline" (click)="copy()" /></ion-col>
            <ion-col size="1"><ion-icon name="close-outline" (click)="clear()" /></ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6" >
              <bk-button 
              label="{{ '@aoc.storage-info.buttonLabel' | translate | async  }}"
              iconName="checkmark-circle-outline" (click)="getRefInfo()" />
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-card-content>
    </ion-card>
    <ion-card>
      <ion-card-header>
        <ion-card-title>{{ '@aoc.storage-sizes.title' | translate | async  }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-grid>
          <ion-row>
            <ion-col>{{ '@aoc.storage-sizes.content' | translate | async  }}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col><ion-checkbox labelPlacement="end" [(ngModel)]="isRecursive">Rekursiv</ion-checkbox></ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="10"><input type="text" [(ngModel)]="path" /></ion-col>
            <ion-col size="1"><ion-icon name="copy-outline" (click)="copy()" /></ion-col>
            <ion-col size="1"><ion-icon name="close-outline" (click)="clear()" /></ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">
              <bk-button 
              label="{{ '@aoc.storage-sizes.buttonLabel' | translate | async  }}"
              iconName="checkmark-circle-outline" (click)="calculateStorageConsumption()" />
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-card-content>
    </ion-card>
  </ion-content>
    `
})
export class FirebaseStorageComponent {
  private toastController = inject(ToastController);
  private documentService = inject(DocumentService);
  private configService = inject(ConfigService);

  public path = '';
  protected size = 0;
  protected isRecursive = false;

  protected async getSize() {
    this.size = await this.documentService.getSize(this.path) ?? 0;
  }

  protected async getRefInfo() {
    await this.documentService.getRefInfo(this.path);
  }

  protected async calculateStorageConsumption() {
    await this.documentService.calculateStorageConsumption(this.path, this.isRecursive);
  }

  protected copy() {
    copyToClipboard(this.path);
    showToast(this.toastController, '@general.operation.copy.conf', this.configService.getConfigNumber('settings_toast_length'));  
  }

  protected clear() {
    this.path = '';
  }
}
