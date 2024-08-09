import { Component, OnInit, inject } from '@angular/core';
import { FilterType, ListType, ListTypes, getOrgId } from '@bk/categories';
import { CollectionNames, MembershipTags, bkTranslate, die } from '@bk/util';
import { export2excel } from '@bk/core';
import { BkAvatarLabelComponent, BkCatComponent, BkLabelSelectModalComponent, BkSearchbarComponent, BkSingleTagComponent, BkSpinnerComponent, BkYearSelectComponent } from '@bk/ui';
import { FullNamePipe, IsSortedPipe, SortDirectionPipe, TranslatePipe } from '@bk/pipes';
import { BaseModelListComponent } from '@bk/base';
import { ALL_RELATIONSHIP_FIELDS, MembershipSubjectModel, RelationshipModel, SubjectModel } from '@bk/models';
import { IonBackdrop, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { uniq } from 'lodash';
import { Browser } from '@capacitor/browser';
import { ScsContactsService } from './scs-contacts.service';

@Component({
  selector: 'bk-membership-scs-contacts-list',
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
    TranslatePipe, FullNamePipe, IsSortedPipe, SortDirectionPipe, AsyncPipe, 
    BkYearSelectComponent, BkLabelSelectModalComponent, BkSingleTagComponent,
    BkAvatarLabelComponent, BkSpinnerComponent, BkSearchbarComponent, BkCatComponent, IonBackdrop,
    IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonMenuButton, IonIcon,
    IonGrid, IonRow, IonCol, IonLabel, IonContent, IonItem
    ],
  template: `
  <ion-header>
  <ion-toolbar color="secondary" id="bkheader">
    <ion-buttons slot="start"><ion-menu-button /></ion-buttons>
    <ion-title>{{ (baseService.filteredItems()).length }} {{ baseService.title() | translate | async }}</ion-title>
    <ion-buttons slot="end">
      @if(authorizationService.hasRole('memberAdmin')) {
        <ion-button (click)="copyEmailAddresses()"><ion-icon slot="icon-only" name="copy-outline" /></ion-button>
        <ion-button (click)="addMembership()"><ion-icon slot="icon-only" name="add-circle-outline" /></ion-button>  
      }
      @if(authorizationService.isPrivilegedOr('memberAdmin')) {
        <ion-button (click)="export()"><ion-icon slot="icon-only" name="download-outline" /></ion-button>
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
          <bk-single-tag (selectedTag)="onTagSelected($event)" [tags]="membershipTags" />
        </ion-col>
        <ion-col size="6" size-md="3">
          @if(baseService.filterType() === FT.Category) {
            <bk-cat [config]="baseService.categoryConfig()!" (ionChange)="onCategoryChange($event)" />
          }
          @if(baseService.filterType() === FT.Year) {
            <bk-year-select [config]="baseService.yearConfig()!" (ionChange)="onYearChange($event)" />
          }
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
              <ion-label color="light"><strong>{{ '@membership.list.header.name' | translate | async }}</strong></ion-label>  
            </ion-button>    
          </ion-col>
          <ion-col size="2" size-md="3" class="ion-hide-md-down">
            <ion-item color="primary" lines="none">
              <ion-label><strong>{{ '@subject.list.header.phone' | translate | async }}</strong></ion-label>
            </ion-item>
          </ion-col>
          <ion-col size="2" size-md="4" class="ion-hide-md-down">
            <ion-item color="primary" lines="none">
              <ion-label><strong>{{ '@subject.list.header.email' | translate | async }}</strong></ion-label>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-toolbar>
  </ion-header>
  <ion-content #content>
    @if(getMemberships(); as memberships) {
      <ion-grid>
        @for(membership of memberships; track membership.bkey) {
          <ion-row>
            <ion-col size="8" size-md="5" (click)="edit(membership.subjectKey, membership.subjectType)">
              <bk-avatar-label key="{{'0.'+membership.subjectKey}}" label="{{membership.subjectName | fullName:membership.subjectName2}}" />
            </ion-col>
            <ion-col size="2" size-md="3">
              @if(membership.subjectPhone) {
                <ion-item lines="none" (click)="usePhone(membership.subjectPhone)">
                  <ion-icon name="call-outline" slot="start" class="ion-hide-md-up"></ion-icon>
                  <span class="ion-hide-md-down">{{membership.subjectPhone }}</span>
                </ion-item>  
              }
            </ion-col>
            <ion-col size="2" size-md="4">
              @if(membership.subjectEmail) {
                <ion-item lines="none" (click)="useEmail(membership.subjectEmail)">
                  <ion-icon name="at-outline" slot="icon-only" class="ion-hide-md-up"/>
                  <span class="ion-hide-md-down">{{membership.subjectEmail }}</span>
                </ion-item>  
              }
            </ion-col>  
          </ion-row>
        }
        </ion-grid>
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
export class MembershipScsContactsListComponent extends BaseModelListComponent implements OnInit {
  public baseService = inject(ScsContactsService);

  public FT = FilterType;
  protected membershipTags = MembershipTags;

  public isProcessing = false;
  protected listType = ListType.MemberScsContacts;
  protected collectionName = CollectionNames.Membership;
  protected listRoute = '/membership/scsContacts';

  ngOnInit(): void {
    this.prepareData(this.listType);
  }

  protected override prepareData(listType: ListType) {
    this.baseService.listType$.next(listType);

    const _memberships$ = this.dataService.searchData(
      this.collectionName, 
      ListTypes[listType].initialQuery ?? [],
      ListTypes[listType].orderBy ?? 'name',
      ListTypes[listType].sortOrder ?? 'asc'
      ) as Observable<RelationshipModel[]>;
    _memberships$.pipe(
      switchMap(_memberships => {
        const _foreignKeys = uniq(_memberships.map(_membership => _membership.subjectKey));
        return combineLatest([
          _memberships$,
          combineLatest(_foreignKeys.map(_key => this.dataService.readModel(CollectionNames.Subject, _key) as unknown as Observable<SubjectModel>))
        ])
      }),  
    map(([memberships, subjects]) => {      // join the data
      return memberships.map(_membership => {
        const _subject = subjects.find(_subject => _subject?.bkey === _membership.subjectKey);
        if (!_subject) die('ScsDeceasedListComponent: subject not found: ' + _membership.subjectKey);
        return this.baseService.joinMembershipWithSubject(_membership, _subject);
      });
    }),
    takeUntilDestroyed(this.destroyRef))
    .subscribe((_data) => {
      this.baseService.groupedItems$.next(_data);
    });
  }
  
  public getMemberships(): MembershipSubjectModel[] {
    return this.baseService.filteredItems() as MembershipSubjectModel[];
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

  public async useEmail(email: string | undefined): Promise<void> {
    if (email) {
      Browser.open({ url: `mailto:${email}` });
    }
  }

  public async usePhone(phone: string | undefined): Promise<void> {
    if (phone) {
      Browser.open({ url: `tel:${phone}` });
    }
  }
}
