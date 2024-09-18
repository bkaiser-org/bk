import { Component, computed, inject, input, OnInit } from '@angular/core';
import { DocumentModel } from '@bk/models';
import { BkSpinnerComponent } from '@bk/ui';
import { FileLogoPipe, FileSizePipe, PrettyDatePipe, TranslatePipe } from '@bk/pipes';
import { AuthorizationService, DataService, getModelAdmin } from '@bk/base';
import { IonAccordion, IonButton, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { ModelType, RelationshipType } from '@bk/categories';
import { DocumentService } from './document.service';
import { getDocumentStoragePath, pickFile, uploadFile } from './document.util';
import { Browser } from '@capacitor/browser';
import { ENV } from '@bk/util';
import { addIcons } from "ionicons";
import { addCircleOutline, createOutline, trashOutline } from "ionicons/icons";
import { from, Observable } from 'rxjs';

@Component({
  selector: 'bk-documents-accordion',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, FileLogoPipe, PrettyDatePipe, FileSizePipe,
    BkSpinnerComponent,
    IonItem, IonLabel, IonButton, IonIcon, IonList,
    IonItemSliding, IonItemOptions, IonItemOption, IonAccordion
  ],
  template: `
  <ion-accordion toggle-icon-slot="start" value="documents">
    <ion-item slot="header" [color]="color()">
      <ion-label>{{ title() | translate | async }}</ion-label>
      @if(isAllowed()) {
        <ion-button fill="outline" (click)="uploadFile()">
          <ion-icon color="secondary" slot="icon-only" name="add-circle-outline" />
        </ion-button>
      }
    </ion-item>
    <div slot="content">
      @if((documents$ | async); as documents) {
        <ion-list lines="none">
          @if(documents.length === 0) {
            <ion-item>
              <ion-label>{{ '@general.noData.documents' | translate | async }}</ion-label>
            </ion-item>
          } @else {
            @for(document of documents; track document.bkey) {
              <ion-item-sliding #slidingItem>
                <ion-item (click)="showDocument(document.url)">
                  <ion-icon src="{{ document.extension | fileLogo }}"></ion-icon>&nbsp;
                  <ion-label>{{ document.fileName }}</ion-label>
                  <ion-label class="ion-hide-md-down">{{ document.dateOfDocCreation | prettyDate }} / {{ document.size | fileSize }}</ion-label>
                </ion-item>
                @if(isAllowed()) {
                  <ion-item-options side="end">
                    <ion-item-option color="danger" (click)="removeDocument(slidingItem, document)"><ion-icon slot="icon-only" name="trash-outline" /></ion-item-option>
                    <ion-item-option color="primary" (click)="editDocument(slidingItem, document)"><ion-icon slot="icon-only" name="create-outline" /></ion-item-option>
                  </ion-item-options>
                }
              </ion-item-sliding>
            }
          }
        </ion-list>
      } @else {
        <bk-spinner />
      }
    </div>
  </ion-accordion>
  `,
})
export class BkDocumentsAccordionComponent implements OnInit {
  public dataService = inject(DataService);
  public documentService = inject(DocumentService);
  public authorizationService = inject(AuthorizationService);
  private env = inject(ENV);

  public modelType = input.required<ModelType>();
  public parentKey = input.required<string>();
  public relationshipType = input<RelationshipType>();
  public color = input('primary');
  public title = input('@document.plural');
  protected isAllowed = computed(() => this.authorizationService.checkAuthorization(getModelAdmin(this.modelType())));
  protected path = computed(() => getDocumentStoragePath(this.env.auth.tenantId, this.modelType(), this.parentKey(), this.relationshipType()));
  public documents$: Observable<DocumentModel[]> | undefined;

  constructor() {
    addIcons({addCircleOutline, createOutline, trashOutline});
  }

  ngOnInit() {
    this.documents$ = from(this.documentService.listDocumentsFromStorageDirectory(this.modelType(), this.parentKey(), this.relationshipType()));
  }

   /**
   * Show a modal to upload a file.
   */
  public async uploadFile(): Promise<void> {
    // show a file dialog to select the file to upload
    const _file = await pickFile([
      'image/png', 
      'image/jpg', 
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]);
    if (_file) {
      // upload the file to the storage
      const _path = this.path();
      if (_path) {
        await uploadFile(_file, _path);
      }
    }
  }

  public async showDocument(url: string): Promise<void> {
    await Browser.open({ url: url, windowName: '_blank' });
  }

  protected async editDocument(slidingItem: IonItemSliding, document: DocumentModel): Promise<void> {
    if (slidingItem) slidingItem.close();
    console.log('editDocument', document);
    // tbd: modal to edit the document
  }

  protected async removeDocument(slidingItem: IonItemSliding, document: DocumentModel): Promise<void> {
    if (slidingItem) slidingItem.close();
    this.documentService.deleteDocument(document);
  }
}
