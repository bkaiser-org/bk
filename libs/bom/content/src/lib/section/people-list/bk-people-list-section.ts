import { Component, computed, input, output } from '@angular/core';
import { ModelType, ViewPosition } from "@bk/categories";
import { NameDisplay } from "@bk/util";
import { SectionModel } from "@bk/models";
import { BkSpinnerComponent } from "@bk/ui";
import { FullNamePipe, TranslatePipe } from "@bk/pipes";
import { IonButton, IonCard, IonCardContent, IonCol, IonGrid, IonItem, IonRow } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { BkPersonsWidgetComponent } from './bk-persons-widget';
import { BkEditorComponent } from '../article/bk-editor';

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
}
