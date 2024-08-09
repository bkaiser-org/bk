import { Component, OnInit, inject } from '@angular/core';
import { CollectionNames, OrgTags, bkTranslate } from '@bk/util';
import { AvatarPipe, BkCatComponent, BkSearchbarComponent, BkSingleTagComponent, BkSpinnerComponent } from '@bk/ui';
import { ALL_SUBJECT_FIELDS, SubjectModel } from '@bk/models';
import { FullNamePipe, IsSortedPipe, SortDirectionPipe, TranslatePipe } from '@bk/pipes';
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonRow, IonTitle, IonToolbar ,IonPopover ,IonList, IonItemSliding, IonItemOptions, IonItemOption, IonAvatar, IonImg } from '@ionic/angular/standalone';
import { BaseModelListComponent } from '@bk/base';
import { AsyncPipe } from '@angular/common';
import { ListType } from '@bk/categories';
import { OrgAllService } from './org-all.service';

@Component({
    selector: 'bk-org-all-list',
    standalone: true,
    imports: [
      TranslatePipe, FullNamePipe, IsSortedPipe, SortDirectionPipe, AsyncPipe, AvatarPipe,
      BkSearchbarComponent, BkSpinnerComponent, BkSingleTagComponent, BkCatComponent,
      IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonMenuButton, IonIcon, IonItemSliding,
      IonGrid, IonRow, IonCol, IonLabel, IonContent, IonItem, IonList, IonPopover,
      IonItemOptions, IonItemOption, IonAvatar, IonImg
    ],
    template: `
    <ion-header>
    <ion-toolbar color="secondary" id="bkheader">
      <ion-buttons slot="start"><ion-menu-button /></ion-buttons>
      <ion-title>{{ baseService.filteredItems().length }} {{ baseService.title() | translate | async }}</ion-title>
      <ion-buttons slot="end">
        @if(authorizationService.hasRole('memberAdmin')) {
          <ion-button (click)="copyEmailAddresses()" id="tooltip-copy"><ion-icon slot="icon-only" name="copy-outline" /></ion-button>
          <ion-popover trigger="tooltip-copy" triggerAction="context-menu">
            <ng-template>
              <ion-content class="ion-padding">{{ '@tooltips.copyEmail' | translate | async}}</ion-content>
            </ng-template>
          </ion-popover>
          <ion-button (click)="add()" id="tooltip-add"><ion-icon slot="icon-only" name="add-circle-outline" /></ion-button>
          <ion-popover trigger="tooltip-add" triggerAction="context-menu">
            <ng-template>
              <ion-content class="ion-padding">{{ '@tooltips.add' + baseService.slug() | translate | async}}</ion-content>
            </ng-template>
          </ion-popover>
        }
        @if(authorizationService.isPrivilegedOr('memberAdmin')) {
          <ion-button (click)="export()" id="tooltip-export"><ion-icon slot="icon-only" name="download-outline" /></ion-button>
          <ion-popover trigger="tooltip-export" triggerAction="context-menu">
            <ng-template>
              <ion-content class="ion-padding">{{ '@tooltips.export' + baseService.slug() | translate | async}}</ion-content>
            </ng-template>
          </ion-popover>
        }
      </ion-buttons>
    </ion-toolbar>
    <ion-toolbar>
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6">
            <bk-searchbar placeholder="{{ '@general.operation.search.placeholder' | translate | async  }}" (ionInput)="baseService.onSearchtermChange($event)" />
          </ion-col>
          <ion-col size="6" size-md="3">
            <bk-single-tag (selectedTag)="onTagSelected($event)" [tags]="orgTags" />
          </ion-col>
          <ion-col size="6" size-md="3">
            <bk-cat [config]="baseService.categoryConfig()!" (ionChange)="onCategoryChange($event)" />
          </ion-col>  
        </ion-row>
      </ion-grid>
    </ion-toolbar>
    <ion-toolbar color="primary">
      <ion-grid>
        <ion-row>
          <ion-col size="8" size-md="5">
            <ion-button (click)="baseService.sort(SF.Name)" fill="clear">
              @if(baseService.currentSortCriteria() | isSorted:SF.Name) {
                <ion-icon color="light" slot="end" name="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
              }
            <ion-label color="light"><strong>{{ '@subject.list.header.name' | translate | async }}</strong></ion-label>
            </ion-button>
          </ion-col>
          <ion-col size="2" size-md="3" class="ion-hide-md-down">
            <ion-item color="primary" lines="none">
              <ion-label><strong>{{ '@subject.list.header.phone' | translate | async }}</strong></ion-label>
            </ion-item>
          </ion-col>
          <ion-col size="2" size-md="4" class="ion-hide-sm-down">
            <ion-item color="primary" lines="none">
            <ion-label><strong>{{ '@subject.list.header.email' | translate | async }}</strong></ion-label>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-toolbar>
  </ion-header>
  <ion-content #content>
    @if(getSubjects(); as subjects) {
        @for(subject of subjects; track subject.bkey) {
          <ion-item-sliding #slidingItem>
            <ion-item>
              <ion-avatar slot="start" (click)="edit(subject.bkey!)">
                <ion-img src="{{ subject.modelType + '.' + subject.bkey | avatar | async }}" alt="Avatar Logo" />
              </ion-avatar>
              <ion-label (click)="edit(subject.bkey!)">{{subject.firstName | fullName:subject.name}}</ion-label>      
              <ion-label>
                @if(subject.fav_phone) {
                  <a href="tel:{{subject.fav_phone}}" style="text-decoration:none;">
                    <ion-icon name="call-outline" slot="start" class="ion-hide-md-up"></ion-icon>
                    <span class="ion-hide-md-down">{{subject.fav_phone }}</span>
                  </a>
                }
              </ion-label>
              <ion-label>
                @if(subject?.fav_email) {
                  <a href="mailto:{{subject.fav_email}}" style="text-decoration:none;">
                    <ion-icon name="at-outline" slot="icon-only" class="ion-hide-md-up"/>
                    <span class="ion-hide-md-down">{{subject.fav_email }}</span>
                  </a>
                }
              </ion-label>  
            </ion-item>
            @if(authorizationService.hasRole('memberAdmin')) {
              <ion-item-options side="end">
                <ion-item-option color="danger" (click)="deleteSubject(slidingItem, subject)"><ion-icon slot="icon-only" name="trash" /></ion-item-option>
              </ion-item-options>
            }
          </ion-item-sliding>
        }
    } @else {
      <bk-spinner />
    }
  </ion-content>
    `
})
export class OrgAllListComponent extends BaseModelListComponent implements OnInit {
  protected baseService = inject(OrgAllService);

  protected listType = ListType.OrgAll;
  protected collectionName = CollectionNames.Org;
  protected listRoute = '/org/all';
  protected orgTags = OrgTags;

  ngOnInit(): void {
    this.prepareData(this.listType);
  }

  public getSubjects(): SubjectModel[] {
    return this.baseService.filteredItems() as SubjectModel[];
  }

  public async export(): Promise<void> {
    await this.baseService.export2excel(bkTranslate(this.baseService.title()), ALL_SUBJECT_FIELDS);
  }

  public async copyEmailAddresses(): Promise<void> {
    const _allEmails = this.baseService.filteredItems().map(_subject => (_subject as SubjectModel).fav_email);
    const _emails = _allEmails.filter(e => e); // this filters all empty emails, because '' is a falsy value
    await this.copy(_emails.toString(), '@subject.address.operation.emailCopy.conf');
  }

  public override async add(): Promise<void> {
    this.appNavigationService.pushLink(this.listRoute);
    await this.baseService.navigateToUrl('/org/new');  
  }

  public async deleteSubject(slidingItem: IonItemSliding, subject: SubjectModel): Promise<void> {
    slidingItem.close();
    await this.baseService.deleteSubject(subject);
    window.location.reload();
  }
}
