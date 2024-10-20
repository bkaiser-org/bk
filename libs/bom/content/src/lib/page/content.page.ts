import { Component, OnInit, inject, input } from '@angular/core';
import { arrayMove, die, AppNavigationService, navigateByUrl } from '@bk/util';
import { firstValueFrom, Observable } from 'rxjs';
import { PageModel } from '@bk/models';
import { BkSpinnerComponent } from '@bk/ui';
import { SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { SectionComponent } from '../section/bk-section';
import { PageService } from './page.service';
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonMenuButton, IonReorder, IonReorderGroup, IonRow, IonTitle, IonToolbar, ItemReorderEventDetail } from '@ionic/angular/standalone';
import { AuthorizationService } from '@bk/base';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'bk-content-page',
  standalone: true,
  imports: [
    BkSpinnerComponent, SectionComponent, 
    TranslatePipe, TranslatePipe, AsyncPipe, SvgIconPipe,
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
        <ion-title>{{ page.name | translate | async }}</ion-title>
        @if(authorizationService.hasRole('contentAdmin')) {
          <ion-buttons slot="end">
            <ion-button (click)="pageService.sortSections(page)">
              <ion-icon slot="icon-only" src="{{'sync-circle-outline' | svgIcon }}" />
            </ion-button>
            <ion-button (click)="pageService.selectSection(page)">
              <ion-icon slot="icon-only" src="{{'reorder-four-outline' | svgIcon }}" />
            </ion-button>
            <ion-button (click)="pageService.addSection(page)">
              <ion-icon slot="icon-only" src="{{'add-circle-outline' | svgIcon }}" />
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
              <ion-icon slot="start" src="{{'add-circle-outline' | svgIcon }}" />
              {{ '@content.section.operation.add.label' | translate | async }}
            </ion-button>
          </ion-item>
        } @else {     <!-- page contains sections -->
          <ion-list class="section-list">
            @for(sectionKey of page.sections; track sectionKey) {
              <ion-item-sliding #slidingList>
                <ion-item lines="none" [id]="sectionKey">
                  <bk-section [sectionKey]="sectionKey" [readOnly]="!isEditMode" />
                </ion-item>
                <ion-item-options side="end">
                  <ion-item-option color="danger" (click)="deleteSection(slidingList, page, sectionKey)"><ion-icon slot="icon-only" src="{{'trash-outline' | svgIcon }}" /></ion-item-option>
                  <ion-item-option color="success" (click)="editSection(slidingList, sectionKey)"><ion-icon slot="icon-only" src="{{'create-outline' | svgIcon }}" /></ion-item-option>
                </ion-item-options>
              </ion-item-sliding>
            }
          </ion-list>
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
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  public authorizationService = inject(AuthorizationService);
  private readonly appNavigationService = inject(AppNavigationService);

  public id = input.required<string>();

  public page$: Observable<PageModel | undefined> | undefined;
  public title = '';
  public isArchivedVisible = false;
  public isEditMode = false;

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

  public async editSection(slidingItem: IonItemSliding, sectionKey: string) { 
    if (slidingItem) slidingItem.close();
    this.appNavigationService.pushLink('private/' + this.id());
    navigateByUrl(this.router, `/section/${sectionKey}`);
  } 

  public deleteSection(slidingItem: IonItemSliding, page: PageModel, sectionKey: string) {
    if (slidingItem) slidingItem.close();
    this.pageService.deleteSectionFromPage(page, sectionKey);
  }

  public async reorder(ev: CustomEvent<ItemReorderEventDetail>) {
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
