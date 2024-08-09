import { Component, computed, inject, input, output } from '@angular/core';
import { ModelType, ViewPosition } from "@bk/categories";
import { NameDisplay } from "@bk/util";
import { SectionModel } from "@bk/models";
import { BkSpinnerComponent } from "@bk/ui";
import { FullNamePipe, TranslatePipe } from "@bk/pipes";
import { IonButton, IonCard, IonCardContent, IonCol, IonGrid, IonItem, IonRow, ModalController } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { BkPersonsWidgetComponent } from './widgets/bk-persons-widget';
import { BkEditorComponent } from './widgets/bk-editor';
import { firstValueFrom } from 'rxjs';
import { SectionService } from './section.service';
import { PreviewModalComponent } from './preview.modal';

@Component({
  selector: 'bk-people-list-section',
  standalone: true,
  imports: [
    BkSpinnerComponent, BkPersonsWidgetComponent, BkEditorComponent,
    FullNamePipe, TranslatePipe, AsyncPipe,
    IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonItem, IonButton
  ],
  styles: [`
    ion-card-content { padding: 0px; }
    ion-card { padding: 0px; margin: 0px; border: 0px; box-shadow: none !important;}
  `],
  template: `
    @if(section(); as section) {
      <ion-card>
        <ion-card-content>
          @switch(section.imagePosition) {
            @case(VP.Left) {
              <ion-grid>
                <ion-row>
                  <ion-col size="12" [sizeMd]="colSizeImage()">
                    <bk-persons-widget [section]="section" />
                  </ion-col>
                  <ion-col size="12" [sizeMd]="colSizeText()">
                    <bk-editor [content]="section.content" [readOnly]="readOnly()" (contentChange)="onContentChange($event)" />
                  </ion-col>
                </ion-row>
              </ion-grid>
            }
            @case(VP.Right) {
              <ion-grid>
                <ion-row>
                  <ion-col size="12" [sizeMd]="colSizeText()">
                    @if(section.properties.avatar?.title) {
                      <ion-item (click)="previewSection()" lines="none">
                        <h2>{{ section.properties.avatar?.title | translate | async }}</h2> 
                      </ion-item>
                    }
                    <bk-editor [content]="section.content" [readOnly]="readOnly()" (contentChange)="onContentChange($event)" />
                  </ion-col>
                  <ion-col size="12" [sizeMd]="colSizeImage()">
                    <bk-persons-widget [section]="section" />
                  </ion-col>
                </ion-row>
              </ion-grid>
            }
            @case(VP.Top) {
              <bk-persons-widget [section]="section" />
              <bk-editor [content]="section.content" [readOnly]="readOnly()" (contentChange)="onContentChange($event)" />
            }
            @case(VP.Bottom) {
              <bk-editor [content]="section.content" [readOnly]="readOnly()" (contentChange)="onContentChange($event)" />
              <bk-persons-widget [section]="section" />
            }
            @default { <!-- VP.None -->
              <bk-editor [content]="section.content" [readOnly]="readOnly()" (contentChange)="onContentChange($event)" />
            }
          }
        </ion-card-content>
      </ion-card>
    } @else {
      <bk-spinner />
    }
  `
})
export class BkPeopleListSectionComponent {
  private sectionService = inject(SectionService);
  private modalController = inject(ModalController);
  public section = input<SectionModel>();
  public readOnly = input(false);
  public contentChange = output<string>();

  public ND = NameDisplay;
  public MT = ModelType;
  public VP = ViewPosition;

  // colSizeImage
  protected colSizeImage = computed(() => {
    return this.section()?.colSize ?? 6;
  });

  // colSizeText
  protected colSizeText = computed(() => {
    return (12 - (this.section()?.colSize ?? 6));
  });

  protected onContentChange(content: string): void {
    this.contentChange.emit(content);
  }

  public async previewSection(): Promise<void> {
    const _sectionKey = this.section()?.properties.avatar?.linkedSection;
    if (!_sectionKey || _sectionKey.length === 0) return;
    const _title = this.section()?.properties.avatar?.title ?? '';
    const _section = await firstValueFrom(this.sectionService.readSection(_sectionKey));
    const _modal = await this.modalController.create({
      component: PreviewModalComponent,
      cssClass: 'wide-modal',
      componentProps: { 
        section: _section,
        title: _title
      }
    });
    _modal.present();
    await _modal.onDidDismiss();
  }
}
