import { Component, OnInit, inject } from '@angular/core';
import { FilterType, ListType, getOrgId } from '@bk/categories';
import { CollectionNames, MembershipTags, bkTranslate } from '@bk/util';
import { export2excel } from '@bk/core';
import { AvatarPipe, BkCatComponent, BkSearchbarComponent, BkSingleTagComponent, BkSpinnerComponent, BkYearSelectComponent } from '@bk/ui';
import { DurationPipe, FullNamePipe, IsSortedPipe, MemberCategoriesPipe, MemberHeaderPipe, MemberValuePipe, SortDirectionPipe, TranslatePipe, YearFormatPipe } from '@bk/pipes';
import { BaseModelListComponent } from '@bk/base';
import { ALL_RELATIONSHIP_FIELDS, RelationshipModel } from '@bk/models';
import { IonAvatar, IonBackdrop, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonMenuButton, IonPopover, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { ScsWomenService } from './scs-women.service';
import { addIcons } from "ionicons";
import { addCircleOutline, copyOutline, createOutline, downloadOutline, arrowUpOutline, arrowDownOutline, trashOutline } from "ionicons/icons";

@Component({
  selector: 'bk-membership-scs-women-list',
  styles: `
  ion-backdrop {
    opacity: 0.5;
    background: var(--ion-color-dark);
  }
  #processingSpinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;

  }
`,
  standalone: true,
  imports: [
    TranslatePipe, FullNamePipe, MemberValuePipe, YearFormatPipe, IsSortedPipe, SortDirectionPipe, MemberHeaderPipe, AsyncPipe,  AvatarPipe,
    MemberCategoriesPipe, DurationPipe,
    BkYearSelectComponent, BkSingleTagComponent,
    BkSpinnerComponent, BkSearchbarComponent, BkCatComponent, IonBackdrop,
    IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonMenuButton, IonIcon,
    IonGrid, IonRow, IonCol, IonLabel, IonContent, IonItem, IonPopover, IonImg,
    IonItemSliding, IonItemOptions, IonItemOption, IonAvatar
    ],
  template: `
  <ion-header>
  <ion-toolbar color="secondary" id="bkheader">
    <ion-buttons slot="start"><ion-menu-button /></ion-buttons>
    <ion-title>{{ (baseService.filteredItems()).length }} {{ baseService.title() | translate | async }}</ion-title>
    <ion-buttons slot="end">
      @if(authorizationService.hasRole('memberAdmin')) {
        <ion-button (click)="copyEmailAddresses()" id="tooltip-copy">
          <ion-icon slot="icon-only" name="copy-outline" />
        </ion-button>
        <ion-popover trigger="tooltip-copy" triggerAction="context-menu">
            <ng-template>
              <ion-content class="ion-padding">{{ '@tooltips.copyEmail' | translate | async}}</ion-content>
            </ng-template>
          </ion-popover>
        <ion-button (click)="addMembership()" id="tooltip-add">
          <ion-icon slot="icon-only" name="add-circle-outline" />
        </ion-button>
        <ion-popover trigger="tooltip-add" triggerAction="context-menu">
            <ng-template>
              <ion-content class="ion-padding">{{ '@tooltips.add' + baseService.slug() | translate | async}}</ion-content>
            </ng-template>
        </ion-popover>
      }
      @if(authorizationService.isPrivilegedOr('memberAdmin')) {
        <ion-button (click)="export()" id="tooltip-export">
          <ion-icon slot="icon-only" name="download-outline" />
        </ion-button>
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
          <bk-searchbar [searchTerm]="searchTerm" placeholder="{{ '@general.operation.search.placeholder' | translate | async  }}" (ionInput)="baseService.onSearchtermChange($event)" />
        </ion-col>
        <ion-col size="6" size-md="3">
          <bk-single-tag (selectedTag)="onTagSelected($event)" [tags]="membershipTags" />
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
        <ion-col size="9" size-md="6">
          <ion-button (click)="baseService.sort(SF.Name)" fill="clear">
            @if(baseService.currentSortCriteria() | isSorted:SF.Name) {
              <ion-icon color="light" slot="end" name="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
            }
            <ion-label color="light"><strong>{{ '@membership.list.header.name' | translate | async }}</strong></ion-label>  
          </ion-button>    
        </ion-col>
        <ion-col size="3" class="ion-hide-md-down">
          <ion-button (click)="baseService.sort(SF.ValidFrom)" fill="clear">
            @if(baseService.currentSortCriteria() | isSorted:SF.ValidFrom) {
              <ion-icon color="light" slot="end" name="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
            }
            <ion-label color="light"><strong>{{ '@membership.list.header.entryExit' | translate | async }}</strong></ion-label>  
          </ion-button>    
        </ion-col>
        <ion-col size="3">
          <ion-button (click)="baseService.sort(SF.SubType)" fill="clear">
            @if(baseService.currentSortCriteria() | isSorted:SF.SubType) {
              <ion-icon color="light" slot="end" name="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
            }
            <ion-label color="light"><strong>{{ baseService.listType()! | memberHeader | translate | async }}</strong></ion-label>
          </ion-button>    
        </ion-col>
      </ion-row>
    </ion-grid>
    </ion-toolbar>
  </ion-header>
  <ion-content #content>
    @if(getMemberships(); as memberships) {
      @for(membership of memberships; track membership.bkey) {
        <ion-item-sliding #slidingItem>
          <ion-item>
            <ion-avatar slot="start" (click)="edit(membership.subjectKey, membership.subjectType)">
              <ion-img src="{{membership.subjectType + '.' + membership.subjectKey | avatar | async}}" alt="Avatar Logo" />
            </ion-avatar>
            <ion-label (click)="edit(membership.subjectKey, membership.subjectType)">{{membership.subjectName | fullName:membership.subjectName2}}</ion-label>
            <ion-label class="ion-hide-md-down">{{ membership.relLog | duration:membership.validTo }}</ion-label>
            <ion-label>{{ membership.relLog | memberCategories }}</ion-label>
          </ion-item>
          @if(authorizationService.hasRole('memberAdmin')) {
            <ion-item-options side="end">
              <ion-item-option color="danger" (click)="endMembership(slidingItem, membership)">
                <ion-icon slot="icon-only" name="trash-outline" />
              </ion-item-option>
              <ion-item-option color="primary" (click)="editMembership(slidingItem, membership)">
                <ion-icon slot="icon-only" name="create-outline" />
              </ion-item-option>
            </ion-item-options>
          }
        </ion-item-sliding>
      }
    } @else {
      <bk-spinner />
    }
  </ion-content>

@if(isProcessing) {
  <bk-spinner id="processingSpinner" />
  <ion-backdrop />
}
  `
})
export class MembershipScsWomenListComponent extends BaseModelListComponent implements OnInit {
  public baseService = inject(ScsWomenService);
  protected searchTerm = '';

  public FT = FilterType;
  protected membershipTags = MembershipTags;

  public isProcessing = false;
  protected listType = ListType.MemberScsWomen;
  protected collectionName = CollectionNames.Membership;
  protected listRoute = '/membership/scsWomen';

  constructor() {
    super();
    addIcons({addCircleOutline, copyOutline, createOutline, downloadOutline, arrowUpOutline, arrowDownOutline, trashOutline});
  }

  ngOnInit(): void {
    this.prepareData(this.listType);
  }

  protected getMemberships(): RelationshipModel[] {
    return this.baseService.filteredItems() as RelationshipModel[];
  }

  /**
   * adding a membership with a new person to the current organisation
   */
  public addMembership(): void {
    this.appNavigationService.pushLink(this.listRoute);
    this.baseService.navigateToUrl('/person/new', {
      orgId: getOrgId(this.listType)
    });
  }

  public async onSelectedIndex(index: number): Promise<void> {
    this.isProcessing = true;
    // export the data in the format selected by the user
    if (index === 0) await export2excel(this.baseService.filteredItems(), ALL_RELATIONSHIP_FIELDS, bkTranslate('@membership.plural'));
    if (index === 1) await this.baseService.exportSrvList(bkTranslate('@membership.operation.select.srv'));
    if (index === 2) await this.baseService.exportAddressList(bkTranslate('@membership.operation.select.address'));
    this.isProcessing = false;
  }

  public async copyEmailAddresses(): Promise<void> {
    this.baseService.copyAllEmailAddresses();
  }

  public async export() {
    this.baseService.export();
  }

  public async editMembership(slidingItem: IonItemSliding, membership: RelationshipModel): Promise<void> {
    if (slidingItem) slidingItem.close();
    if (this.authorizationService.hasRole('memberAdmin')) {
      await this.baseService.editMembership(membership);
    }
  }

  public async endMembership(slidingItem: IonItemSliding, membership: RelationshipModel): Promise<void> {
    if (slidingItem) slidingItem.close();
      await this.baseService.endMembership(membership);
  }
}
