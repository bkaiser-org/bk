import { Component, OnInit, inject } from '@angular/core';
import { SectionModel } from '@bk/models';
import { CollectionNames, navigateByUrl } from '@bk/util';
import { BkCardSelectModalComponent, BkCatComponent, BkSearchbarComponent, BkSpinnerComponent } from '@bk/ui';
import { CategoryNamePipe, SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { IonBackdrop, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonMenuButton, IonRow, IonTitle, IonToolbar, ModalController   } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { ListType, SectionTypes } from '@bk/categories';
import { BaseModelListComponent } from '@bk/base';
import { SectionAllService } from './section-all.service';
import { createSection } from '../section.util';
import { Router } from '@angular/router';

@Component({
  selector: 'bk-section-all-list',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, CategoryNamePipe, SvgIconPipe,
    BkSearchbarComponent, BkCatComponent, BkSpinnerComponent,
    IonToolbar, IonButton, IonIcon, IonLabel, IonHeader, IonButtons, 
    IonTitle, IonMenuButton, IonContent, IonItem, IonBackdrop,
    IonItemSliding, IonItemOptions, IonItemOption,
    IonGrid, IonRow, IonCol 
  ],
  template: `
  <ion-header>
    <!-- page header -->
    <ion-toolbar color="secondary" id="bkheader">
      <ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons>
      <ion-title>{{ '@content.section.plural' | translate | async }}</ion-title>
      <ion-buttons slot="end">
        @if(authorizationService.isPrivilegedOr('contentAdmin')) {
          <ion-button (click)="addSection()">
            <ion-icon slot="icon-only" src="{{'add-circle-outline' | svgIcon }}" />
          </ion-button>
        }
      </ion-buttons>
    </ion-toolbar>

    <!-- description -->
    <ion-toolbar class="ion-hide-md-down">
      <ion-item lines="none">
        <ion-label>{{ '@content.section.field.description' | translate | async }}</ion-label>
      </ion-item>
    </ion-toolbar>

   <!-- search and category -->
    <ion-toolbar>
      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <bk-searchbar placeholder="{{ '@general.operation.search.placeholder' | translate | async }}" (ionInput)="baseService.onSearchtermChange($event)" />
          </ion-col>
          <ion-col size="6">
            <bk-cat [config]="baseService.categoryConfig()!" (ionChange)="onCategoryChange($event)" />
         </ion-col>
        </ion-row>
      </ion-grid>
    </ion-toolbar>

    <!-- list header -->
    <ion-toolbar color="primary">
      <ion-item color="primary" lines="none">
        <ion-grid>
          <ion-row>
            <ion-col size="4" class="ion-hide-md-down">
              <ion-label><strong>{{ '@content.section.list.header.key' | translate | async }}</strong></ion-label>  
            </ion-col>
            <ion-col size="6" size-md="4">
              <ion-label><strong>{{ '@content.section.list.header.name' | translate | async }}</strong></ion-label>  
            </ion-col>
            <ion-col size="6" size-md="4">
                <ion-label><strong>{{ '@content.section.list.header.type' | translate | async }}</strong></ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>
    </ion-toolbar>
  </ion-header>

  <!-- Data -->
<ion-content #content>
  @if(getSections(); as sections) {
    @if (sections.length === 0) {
      <ion-toolbar>
      <ion-item>
        <ion-label>{{ '@content.section.field.empty' | translate | async }}</ion-label>
      </ion-item>
    </ion-toolbar>
    } @else {
      @for(section of sections; track section.bkey) {
        <ion-item-sliding #slidingItem>
          <ion-item (click)="editSection(slidingItem, section.bkey)">
            <ion-label class="ion-hide-md-down">{{ section.bkey }}</ion-label>
            <ion-label>{{ section.name }}</ion-label>
            <ion-label>{{ section.category | categoryName:sectionTypes }}</ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" (click)="deleteSection(slidingItem, section)">
              <ion-icon slot="icon-only" src="{{'trash' | svgIcon }}" />
            </ion-item-option>
            <ion-item-option color="primary" (click)="editSection(slidingItem, section.bkey)">
              <ion-icon slot="icon-only" src="{{'create-outline' | svgIcon }}" />
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      }
    }
  } @else {
    <bk-spinner />
    <ion-backdrop />
  }
</ion-content>
  `
})
export class SectionAllListComponent extends BaseModelListComponent implements OnInit {
  private readonly router = inject(Router);
  public baseService = inject(SectionAllService);
  protected listType = ListType.SectionAll;
  protected collectionName = CollectionNames.Section;
  protected listRoute = '/section/all';
  protected modalController = inject(ModalController);
  protected sectionTypes = SectionTypes;

  ngOnInit(): void {
    this.prepareData(this.listType);
  }

  public getSections(): SectionModel[] {
    return this.baseService.filteredItems() as SectionModel[];
  }

  public async addSection() {
    const _modal = await this.modalController.create({
      component: BkCardSelectModalComponent,
      cssClass: 'full-modal',
      componentProps: {
        categories: SectionTypes,
        slug: 'section'
      }
    });
    _modal.present();
    const { data, role } = await _modal.onWillDismiss();
    if (role === 'confirm') { // data = selected Category
      const _section = createSection(data, this.env.auth.tenantId);
      const _sectionKey = await this.baseService.createSection(_section);
      if (_sectionKey) {
        this.editSection(undefined, _sectionKey);
      }
    }
  }

  public async editSection(slidingItem: IonItemSliding | undefined, sectionKey: string | undefined) { 
    if (slidingItem) slidingItem.close();
    if (sectionKey) {
      this.appNavigationService.pushLink(this.listRoute);
      navigateByUrl(this.router, `/section/${sectionKey}`);  
    }
  } 
  
  public async deleteSection(slidingItem: IonItemSliding, section: SectionModel): Promise<void> {
    slidingItem.close();
    await this.baseService.deleteSection(section);
  }
}
