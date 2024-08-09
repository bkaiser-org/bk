import { Component, OnInit, inject, input } from '@angular/core';
import { Observable } from 'rxjs';
import { PrettyDatePipe, TranslatePipe } from '@bk/pipes';
import { CommentModel } from '@bk/models';
import { IonAccordion, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRow, IonTextarea } from '@ionic/angular/standalone';
import { CommentService } from './comment.service';
import { AsyncPipe } from '@angular/common';
import { BkSpinnerComponent } from '@bk/ui';

@Component({
  selector: 'bk-comments-accordion',
  standalone: true,
  imports: [
    PrettyDatePipe, TranslatePipe, AsyncPipe,
    IonAccordion, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonTextarea, IonIcon,
    BkSpinnerComponent
  ],
  template: `
    <ion-accordion toggle-icon-slot="start" value="comments">
      <ion-item slot="header" color="primary">
        <ion-label>{{ '@comment.plural' | translate | async }}</ion-label>
      </ion-item>
    <div slot="content">
      <ion-grid style="width: 100%; height: 100%;">
        <!-- comment input row -->
        @if (!readOnly()) {
          <ion-row>
            <ion-col size="11">
              <ion-textarea #bkComment 
                (keyup.enter)="addComment(bkComment)"
                label = "{{'@input.' + this.name() + '.label' | translate | async }}"
                labelPlacement = "floating"
                placeholder = "{{'@input.' + this.name() + '.placeholder' | translate | async }}"
                [counter]="true"
                fill="outline"
                [maxlength]="1000"
                [rows]="2"
                inputmode="text"
                type="text"
                [autoGrow]="true">
              </ion-textarea>
            </ion-col>
          </ion-row>
        }
        <!-- comment header -->
        <ion-row>
          <ion-col size="4"><strong>{{ '@input.comment.date' | translate | async }}/{{ '@input.comment.authorName' | translate | async }}</strong></ion-col>
          <ion-col size="8"><strong>{{ '@input.comment.label' | translate | async}}</strong></ion-col>
        </ion-row>
        <!-- list of comments -->
        @if((comments$ | async); as comments) {
          @if(comments.length === 0) {
            <ion-row>
              <ion-col size="12"><small>{{ '@general.noData.comments' | translate | async }}</small></ion-col>
            </ion-row>
          } @else {
            @for (comment of comments; track comment.bkey) {
              <ion-row>
                <ion-col size="4"><small>{{ comment.creationDate | prettyDate }}/{{ comment.name }}</small></ion-col>
                <ion-col size="8"><small>{{ comment.description | translate | async }}</small></ion-col>  
              </ion-row>
            }
          }
        } @else {
          <bk-spinner />
        }
      </ion-grid>
    </div>
  `
})
export class BkCommentsAccordionComponent implements OnInit {
  private commentService = inject(CommentService);
  public name = input('comment'); // mandatory name for the form control
  public collectionName = input.required<string>();
  public parentKey = input.required<string>();
  public readOnly = input(false);
  public comments$: Observable<CommentModel[]> | undefined

  ngOnInit(): void {
    this.comments$ = this.commentService.listComments(this.collectionName(), this.parentKey());  
  }

  public async addComment(bkComment: IonTextarea): Promise<void> {
    await this.commentService.createComment(this.collectionName(), this.parentKey(), bkComment.value?.trim());
    bkComment.value = '';  // reset input field
  }
}
