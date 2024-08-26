import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@bk/pipes';
import { BkCopyButtonComponent } from '@bk/ui';
import { IonButton, IonIcon, IonItem } from '@ionic/angular/standalone';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { BkEditorToolbar } from './bk-editor-toolbar';
import { addIcons } from "ionicons";
import { closeOutline } from "ionicons/icons";

@Component({
  selector: 'bk-editor',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    NgxEditorModule, FormsModule,
    IonItem, IonIcon, IonButton,
    BkCopyButtonComponent
  ],
  styles: [`
  ::ng-deep {
    .NgxEditor { border: none !important; padding: 0;}
  }
  `],
  template: `
    @if(editor && content(); as content) {
      <div class="editor">
        @if(!readOnly()) {   <!-- editing mode -->
          <ngx-editor-menu [editor]="editor!" [toolbar]="toolbar" /> 
          <ngx-editor [editor]="editor!" [ngModel]="content" (ngModelChange)="updateContent($event)" name="content" [disabled]="readOnly()" [placeholder]="'Text...'" />
          <ion-item lines="none">
            @if (clearable()) {
              <ion-button fill="clear" (click)="updateContent('<p></p>')">
                <ion-icon slot="start" name="close-outline" />
                {{ '@general.operation.deleteContent' | translate | async }}
              </ion-button>
            }
            @if (copyable()) {
              <bk-copy-button [value]="content" [label]="'@general.operation.copy.label'" />
            }
          </ion-item>
        } @else {           <!-- viewing mode -->
          @if(content && content.length > 0 && content !== '<p></p>') {
            <ngx-editor [editor]="editor!" [ngModel]="content" [disabled]="readOnly()" [placeholder]="'Text...'" />
          }
        }
      </div>
    }
  `
})
export class BkEditorComponent implements OnInit, OnDestroy {
  public content = model('');
  public readOnly = input(true);
  public clearable = input(true); // show a button to clear the notes
  public copyable = input(true); // show a button to copy the notes
  public changedContent = output<string>();

  public editor: Editor | undefined;
  protected toolbar = BkEditorToolbar;

  constructor() {
    addIcons({closeOutline});
  }

  ngOnInit() {
    this.editor = new Editor({
      history: true,
      keyboardShortcuts: true,
      inputRules: false
    });
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  protected updateContent(newContent: string): void {
    // editor.setContent(newContent)
    this.content.update(() => newContent);
    this.changedContent.emit(newContent);
  }
}