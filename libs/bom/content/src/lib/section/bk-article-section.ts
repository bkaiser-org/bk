import { CUSTOM_ELEMENTS_SCHEMA, Component, computed, input, output } from '@angular/core';
import { SectionModel } from '@bk/models';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonLabel, IonRow } from '@ionic/angular/standalone';
import { BkImgComponent, BkSpinnerComponent } from '@bk/ui';
import { ViewPosition } from '@bk/categories';
import { BkEditorComponent } from './widgets/bk-editor';
import { AsyncPipe } from '@angular/common';
import { newImage } from './section.util';

@Component({
  selector: 'bk-article-section',
  standalone: true,
  imports: [
    AsyncPipe,
    BkSpinnerComponent, BkEditorComponent, BkImgComponent,
    IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
    IonGrid, IonRow, IonCol, IonLabel
  ],
  schemas: [ 
    CUSTOM_ELEMENTS_SCHEMA
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
                    <bk-img [image]="image()" />
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
                    <bk-img [image]="image()" />
                  </ion-col>
                </ion-row>
              </ion-grid>
            }
            @case(VP.Top) {
              <bk-img [image]="image()" />
              <bk-editor [content]="section.content" [readOnly]="readOnly()" (contentChange)="onContentChange($event)" />
            }
            @case(VP.Bottom) {
              <bk-editor [content]="section.content" [readOnly]="readOnly()" (contentChange)="onContentChange($event)" />
              <bk-img [image]="image()" />
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
export class BkArticleSectionComponent {
  public section = input<SectionModel>();
  public readOnly = input(false);
  protected image = computed(() => this.section()?.properties.image ?? newImage());
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