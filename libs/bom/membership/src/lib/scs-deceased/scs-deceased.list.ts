import { Component, OnInit, inject } from '@angular/core';
import { FilterType, ListType, ListTypes } from '@bk/categories';
import { CollectionNames, MembershipTags, die, uniqueElements } from '@bk/util';
import { BkAvatarLabelComponent, BkCatComponent, BkSearchbarComponent, BkSingleTagComponent, BkSpinnerComponent, BkYearSelectComponent } from '@bk/ui';
import { DurationPipe, FullNamePipe, IsSortedPipe, MemberCategoriesPipe, MemberHeaderPipe, PrettyDatePipe, SortDirectionPipe, SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { BaseModelListComponent } from '@bk/base';
import { MembershipSubjectModel, RelationshipModel, SubjectModel } from '@bk/models';
import { IonBackdrop, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { ScsDeceasedService } from './scs-deceased.service';

@Component({
  selector: 'bk-membership-scs-deceased-list',
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
    TranslatePipe, FullNamePipe, IsSortedPipe, SortDirectionPipe, AsyncPipe, MemberHeaderPipe,
    DurationPipe, MemberCategoriesPipe, PrettyDatePipe, SvgIconPipe,
    BkYearSelectComponent, BkSingleTagComponent,
    BkAvatarLabelComponent, BkSpinnerComponent, BkSearchbarComponent, BkCatComponent, IonBackdrop,
    IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonMenuButton, IonIcon,
    IonGrid, IonRow, IonCol, IonLabel, IonContent, IonItem
    ],
  template: `
  <ion-header>
  <ion-toolbar color="secondary" id="bkheader">
    <ion-buttons slot="start"><ion-menu-button /></ion-buttons>
    <ion-title>{{ (baseService.filteredItems()).length }} {{ baseService.title() | translate | async }}</ion-title>
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
      </ion-row>
    </ion-grid>
  </ion-toolbar>
    <ion-toolbar color="primary">
      <ion-grid>
        <ion-row>
          <ion-col size="9" size-md="6">
            <ion-button (click)="baseService.sort(SF.Name)" fill="clear">
              @if(baseService.currentSortCriteria() | isSorted:SF.Name) {
                <ion-icon color="light" slot="end" src="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
              }
              <ion-label color="light"><strong>{{ '@membership.list.header.name' | translate | async }}</strong></ion-label>  
            </ion-button>    
          </ion-col>
          <ion-col size="3" class="ion-hide-md-down">
          <ion-button (click)="baseService.sort(SF.ValidFrom)" fill="clear">
            @if(baseService.currentSortCriteria() | isSorted:SF.ValidFrom) {
              <ion-icon color="light" slot="end" src="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
            }
            <ion-label color="light"><strong>{{ '@membership.list.header.entryExit' | translate | async }}</strong></ion-label>  
          </ion-button>    
        </ion-col>
        <ion-col size="3">
          <ion-button (click)="baseService.sort(SF.DateOfDeath)" fill="clear">
            @if(baseService.currentSortCriteria() | isSorted:SF.DateOfDeath) {
              <ion-icon color="light" slot="end" src="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
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
      <ion-grid>
        @for(membership of memberships; track membership.bkey) {
          <ion-row (click)="edit(membership.subjectKey, membership.subjectType)">
            <ion-col size="9" size-md="6">
              <bk-avatar-label key="{{ '0.' + membership.subjectKey}}" label="{{membership.subjectName | fullName:membership.subjectName2}}" />
            </ion-col>
            <ion-col size="3" class="ion-hide-md-down">
              <ion-item lines="none">
                <ion-label>{{ membership.relLog | duration:membership.validTo }}</ion-label>
              </ion-item>
            </ion-col>
            <ion-col size="3">
              <ion-item lines="none">
                <ion-label>{{ membership.subjectDateOfDeath | prettyDate }}</ion-label>
              </ion-item>
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
export class MembershipScsDeceasedListComponent extends BaseModelListComponent implements OnInit {
  public baseService = inject(ScsDeceasedService);

  public FT = FilterType;
  protected membershipTags = MembershipTags;

  public isProcessing = false;
  protected listType = ListType.MemberScsDeceased;
  protected collectionName = CollectionNames.Membership;
  protected listRoute = '/membership/scsDeceased';

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
        const _foreignKeys = uniqueElements(_memberships.map(_membership => _membership.subjectKey));
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
      }).filter(_membership => ( _membership.subjectDateOfDeath && _membership.subjectDateOfDeath.length > 0));
    }),
    takeUntilDestroyed(this.destroyRef))
    .subscribe((_data) => {
      this.baseService.groupedItems$.next(_data);
    });
  }
  
  public getMemberships(): MembershipSubjectModel[] {
    return this.baseService.filteredItems() as MembershipSubjectModel[];
  }
}
