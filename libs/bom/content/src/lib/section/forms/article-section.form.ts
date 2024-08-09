import { Component, model, output } from '@angular/core';
import { SectionFormModel } from '@bk/models';
import { BkCatInputComponent } from '@bk/ui';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonRow } from '@ionic/angular/standalone';
import { BkEditorComponent } from '../widgets/bk-editor';
import { ViewPositions } from '@bk/categories';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bk-article-section-form',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    BkCatInputComponent, BkEditorComponent
  ],
  template: `
    @if(vm(); as vm) {
      <ion-row>
        <ion-col size="12">
          <ion-card>
            <ion-card-header>
              <ion-card-title>{{ '@content.section.forms.article.title' | translate | async}}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <bk-cat-input name="imagePosition" [value]="vm.imagePosition!" [categories]="viewPositions" (changed)="updateImagePosition($event)" />
              <bk-editor [content]="vm.content ?? ''" [readOnly]="false" (contentChange)="onContentChange($event)" />
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    }
  `
})
export class BkArticleSectionFormComponent {
  public vm = model.required<SectionFormModel>();

  public contentChange = output<string>();
  public positionChange = output<number>();
  public changedUrl = output<string>();

  protected viewPositions = ViewPositions;

  protected updateImagePosition(position: number): void {
    this.vm.update((_vm) => ({..._vm, imagePosition: position}));
    this.positionChange.emit(position);
  }

  protected onContentChange(changedContent: string): void {
    this.vm.update((_vm) => ({..._vm, content: changedContent}));
    this.contentChange.emit(changedContent);
  }
}