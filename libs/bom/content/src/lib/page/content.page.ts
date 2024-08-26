import { Component, OnInit, inject, input } from '@angular/core';
import { arrayMove, die, AppNavigationService, navigateByUrl } from '@bk/util';
import { firstValueFrom, Observable } from 'rxjs';
import { PageModel } from '@bk/models';
import { BkSpinnerComponent } from '@bk/ui';
import { TranslatePipe } from '@bk/pipes';
import { BkSectionComponent } from '../section/bk-section';
import { PageService } from './page.service';
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonMenuButton, IonReorder, IonReorderGroup, IonRow, IonTitle, IonToolbar, ItemReorderEventDetail } from '@ionic/angular/standalone';
import { AuthorizationService } from '@bk/base';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from "ionicons";
import { addCircleOutline, camera, createOutline, reorderFourOutline, syncCircleOutline, toggle, trashOutline } from "ionicons/icons";

@Component({
  selector: 'bk-content-page',
  standalone: true,
  imports: [
    BkSpinnerComponent, BkSectionComponent, 
    TranslatePipe, TranslatePipe, AsyncPipe,
    IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonMenuButton,
    IonContent, IonGrid, IonRow, IonCol, IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption,
    IonReorderGroup, IonReorder, IonLabel
  ],
  styles: [`
  bk-section { width: 100%; }
`],
  template: `
  @if(page$ | async; as page) {
    <ion-header>
      <ion-toolbar color="secondary" id="bkheader">
        <ion-buttons slot="start"><ion-menu-button /></ion-buttons>      
        <ion-title>{{ page?.name | translate | async }}</ion-title>
        @if(authorizationService.hasRole('contentAdmin')) {
          <ion-buttons slot="end">
          <ion-button (click)="toggleEditMode()">
            <ion-icon slot="icon-only" name="toggle" />
          </ion-button>

          <ion-button (click)="toggleReordering()">
            <ion-icon slot="icon-only" name="sync-circle-outline" />
          </ion-button>
          <ion-button (click)="pageService.selectSection(page)">
            <ion-icon slot="icon-only" name="reorder-four-outline" />
          </ion-button>
          <ion-button (click)="pageService.addSection(page)">
            <ion-icon slot="icon-only" name="add-circle-outline" />
          </ion-button>
        </ion-buttons>
        }
      </ion-toolbar>
    </ion-header>
    <ion-content>
      @if(authorizationService.hasRole('contentAdmin')) {
        @if(!page.sections || page.sections.length === 0) {
          <ion-item lines="none">
            <ion-label class="ion-text-wrap">{{ '@content.section.error.emptyPage' | translate | async }}</ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-button (click)="pageService.addSection(page)">
              <ion-icon slot="start" name="add-circle-outline" />
              {{ '@content.section.operation.add.label' | translate | async }}
            </ion-button>
          </ion-item>
        } @else {     <!-- page contains sections -->
          @if (doReorder) {
            <!-- Casting $event to $any is a temporary fix for this bug https://github.com/ionic-team/ionic-framework/issues/24245 -->
            <ion-reorder-group disabled="false" (ionItemReorder)="handleReorder($any($event))">
              @for(sectionKey of page.sections; track sectionKey) {
                <ion-item>
                  <bk-section [sectionKey]="sectionKey" [readOnly]="true" />
                  <ion-reorder slot="end" />
                </ion-item>
              }
            </ion-reorder-group>
          } @else {
            <ion-list class="section-list">
              @for(sectionKey of page.sections; track sectionKey) {
                <ion-item-sliding #slidingList>
                  <ion-item lines="none" [id]="sectionKey">
                    <bk-section [sectionKey]="sectionKey" [readOnly]="!isEditMode" />
                  </ion-item>
                  <ion-item-options side="end">
                    <ion-item-option color="danger" (click)="deleteSection(slidingList, page, sectionKey)"><ion-icon slot="icon-only" name="trash-outline" /></ion-item-option>
                    <!-- <ion-item-option color="light" (click)="uploadImage(slidingList, sectionKey)"><ion-icon slot="icon-only" name="camera" /></ion-item-option> -->
                    <!-- <ion-item-option color="light" (click)="uploadDocument(slidingList, sectionKey)"><ion-icon slot="icon-only" name="document" /></ion-item-option> -->
                    <ion-item-option color="success" (click)="editSection(slidingList, sectionKey)"><ion-icon slot="icon-only" name="create-outline" /></ion-item-option>
                  </ion-item-options>
                </ion-item-sliding>
              }
            </ion-list>
          }
        }
      } @else { <!-- not contentAdmin -->
        @if(!page.sections || page.sections.length === 0) {
          <ion-item lines="none"><ion-label class="ion-text-wrap">{{ '@content.section.error.emptyPageReadOnly' | translate | async }}</ion-label></ion-item>
        } @else {
          <ion-list class="section-list">
            @for(sectionKey of page.sections; track sectionKey) {
                <bk-section [sectionKey]="sectionKey" [readOnly]="true" />
              }
          </ion-list>
        }
      }
    </ion-content>
  } @else {
    <ion-header>
      <ion-toolbar color="secondary" id="bkheader">
        <ion-buttons slot="start"><ion-menu-button /></ion-buttons>      
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <bk-spinner />
    </ion-content>
  }
  `
})
export class ContentPageComponent implements OnInit {
  protected pageService = inject(PageService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  public authorizationService = inject(AuthorizationService);
  private appNavigationService = inject(AppNavigationService);

  public id = input.required<string>();

  private currentPage: PageModel | undefined;
  public page$: Observable<PageModel | undefined> | undefined;
  public title = '';
  public isArchivedVisible = false;
  public isEditMode = false;
  public doReorder = false;

  constructor() {
    addIcons({addCircleOutline, camera, createOutline, reorderFourOutline, syncCircleOutline, toggle, trashOutline });
  }

  ngOnInit(): void {
    this.activatedRoute.fragment.subscribe((fragment: string | null) => {
      if (fragment) {
        this.jumpToSection(fragment);
      }
    });
    this.page$ = this.pageService.readPage(this.id());
    this.appNavigationService.pushLink('private/' + this.id());
  }

  private jumpToSection(sectionKey: string) {
    if (sectionKey) document.getElementById(sectionKey)?.scrollIntoView({ behavior: 'smooth' });
  }

  public async save(): Promise<void> {
    if (this.currentPage) {
      await this.pageService.updatePage(this.currentPage);
    }
  }

  /* public async uploadImage(slidingItem: IonItemSliding, sectionKey: string): Promise<void> {
    if (slidingItem) slidingItem.close();

    // select a photo from the camera or the photo library
    const _file = await this.documentService.pickPhoto();

    // upload the file to the storage and upload the download url
    await this.uploadAndUpdateUrl(_file, sectionKey);
  } */

  /* public async uploadDocument(slidingItem: IonItemSliding, sectionKey: string): Promise<void> {
    if (slidingItem) slidingItem.close();

    // show a file dialog to select the file to upload
    const _file = await this.documentService.pickFile([]);  // any file type is allowed

    // upload the file to the storage and upload the download url
    await this.uploadAndUpdateUrl(_file, sectionKey);
  } */

/*   private async uploadAndUpdateUrl(file: File | undefined, sectionKey: string): Promise<void> {
    if (file) {
      // upload the file to the storage
      const _path = await this.documentService.uploadFileToModel(file, ModelType.Section, sectionKey);

      // update the section with the download url
      this.sectionService.updateDownloadUrl(sectionKey, _path);
    }
  } */

  public toggleReordering() {
    this.doReorder = !this.doReorder;
  }

  public toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  public async editSection(slidingItem: IonItemSliding, sectionKey: string) { 
    if (slidingItem) slidingItem.close();
    this.appNavigationService.pushLink('private/' + this.id());
    navigateByUrl(this.router, `/section/${sectionKey}`);
  } 

  public deleteSection(slidingItem: IonItemSliding, page: PageModel, sectionKey: string) {
    if (slidingItem) slidingItem.close();
    this.pageService.deleteSectionFromPage(page, sectionKey);
  }

  public async handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    if (!this.page$) die('ContentPage.handleReorder: page$ is mandatory.');
    const _page = await firstValueFrom(this.page$) ?? die('ContentPage.handleReorder: page is mandatory.');
    if (!_page.sections) die('ContentPage.handleReorder: _sections is mandatory.');
    arrayMove(_page.sections, ev.detail.from, ev.detail.to);
    await this.pageService.updatePage(_page);
    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }
}
