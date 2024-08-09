import { Component, computed, input, output } from '@angular/core';
import { SectionModel } from '@bk/models';
import { IonCard, IonCardContent, IonCheckbox, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { BkSpinnerComponent } from '@bk/ui';
import { ViewPosition } from '@bk/categories';
import { ButtonWidgetComponent } from './widgets/bk-button-widget';
import { BkEditorComponent } from './widgets/bk-editor';

@Component({
  selector: 'bk-button-section',
  standalone: true,
  imports: [
    BkSpinnerComponent, ButtonWidgetComponent,
    BkEditorComponent,
    IonCard, IonCardContent,
    IonGrid, IonRow, IonCol, IonCheckbox
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
                  <ion-col size="12" [size]="colSizeImage()">
                    <bk-button-widget [section]="section" />
                  </ion-col>
                  <ion-col size="12" [size]="colSizeText()">
                    <bk-editor [content]="section.content" [readOnly]="readOnly()" (contentChange)="onContentChange($event)" />
                  </ion-col>
                </ion-row>
              </ion-grid>
            }
            @case(VP.Right) {
              <ion-grid>
                <ion-row>
                  <ion-col size="12" [size]="colSizeText()">
                    <bk-editor [content]="section.content" [readOnly]="readOnly()" (contentChange)="onContentChange($event)" />
                  </ion-col>
                  <ion-col size="12" [size]="colSizeImage()">
                    <bk-button-widget [section]="section" />
                  </ion-col>
                </ion-row>
              </ion-grid>
            }
            @case(VP.Top) {
              <bk-button-widget [section]="section" />
              <bk-editor [content]="section.content" [readOnly]="readOnly()" (contentChange)="onContentChange($event)" />
            }
            @case(VP.Bottom) {
              <bk-editor [content]="section.content" [readOnly]="readOnly()" (contentChange)="onContentChange($event)" />
              <bk-button-widget [section]="section" />
            }
            @default {  <!-- VP.None -->
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
export class BkButtonSectionComponent {
  public section = input<SectionModel>();
  public readOnly = input(false);
  public contentChange = output<string>();

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