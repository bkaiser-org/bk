import { Component, OnInit, inject } from '@angular/core';
import { CollectionNames, GroupTags, bkPrompt } from '@bk/util';
import { AvatarPipe, BkCatComponent, BkSearchbarComponent, BkSingleTagComponent, BkSpinnerComponent } from '@bk/ui';
import { SubjectModel } from '@bk/models';
import { FullNamePipe, IsSortedPipe, SortDirectionPipe, SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonRow, IonTitle, IonToolbar ,IonPopover ,IonList, AlertController, IonItemSliding, IonItemOptions, IonItemOption, IonAvatar, IonImg } from '@ionic/angular/standalone';
import { BaseModelListComponent } from '@bk/base';
import { AsyncPipe } from '@angular/common';
import { ListType, ModelType, OrgType } from '@bk/categories';
import { GroupAllService } from './group-all.service';

@Component({
    selector: 'bk-group-all-list',
    standalone: true,
    imports: [
      TranslatePipe, FullNamePipe, IsSortedPipe, SortDirectionPipe, AsyncPipe, AvatarPipe, SvgIconPipe,
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
          <ion-button (click)="add()" id="tooltip-add">
            <ion-icon slot="icon-only" src="{{'add-circle-outline' | svgIcon }}" />
          </ion-button>
          <ion-popover trigger="tooltip-add" triggerAction="context-menu">
            <ng-template>
              <ion-content class="ion-padding">{{ '@tooltips.add.group' | translate | async}}</ion-content>
            </ng-template>
          </ion-popover>
        }
        @if(authorizationService.isPrivilegedOr('memberAdmin')) {
          <ion-button (click)="export()" id="tooltip-export">
            <ion-icon slot="icon-only" src="{{'download-outline' | svgIcon }}" />
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
            <bk-searchbar placeholder="{{ '@general.operation.search.placeholder' | translate | async  }}" (ionInput)="baseService.onSearchtermChange($event)" />
          </ion-col>
          <ion-col size="6" size-md="3">
            <bk-single-tag (selectedTag)="onTagSelected($event)" [tags]="groupTags" />
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
                <ion-icon color="light" slot="end" src="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
              }
            <ion-label color="light"><strong>{{ '@subject.list.header.name' | translate | async }}</strong></ion-label>
            </ion-button>
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
                    <ion-icon src="{{'call-outline' | svgIcon }}" slot="start" class="ion-hide-md-up" />
                    <span class="ion-hide-md-down">{{subject.fav_phone }}</span>
                  </a>
                }
              </ion-label>
              <ion-label>
                @if(subject?.fav_email) {
                  <a href="mailto:{{subject.fav_email}}" style="text-decoration:none;">
                    <ion-icon src="{{'at-outline' | svgIcon }}" slot="icon-only" class="ion-hide-md-up"/>
                    <span class="ion-hide-md-down">{{subject.fav_email }}</span>
                  </a>
                }
              </ion-label>  
            </ion-item>
            @if(authorizationService.hasRole('memberAdmin')) {
              <ion-item-options side="end">
                <ion-item-option color="danger" (click)="deleteSubject(slidingItem, subject)">
                  <ion-icon slot="icon-only" src="{{'trash-outline' | svgIcon }}" />
                </ion-item-option>
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
export class GroupAllListComponent extends BaseModelListComponent implements OnInit {
  private alertController = inject(AlertController);
  protected baseService = inject(GroupAllService);

  protected listType = ListType.GroupAll;
  protected collectionName = CollectionNames.Subject;
  protected listRoute = '/group/all';
  protected groupTags = GroupTags;

  ngOnInit(): void {
    this.prepareData(this.listType);
  }

  public getSubjects(): SubjectModel[] {
    return this.baseService.filteredItems() as SubjectModel[];
  }

  public async export(): Promise<void> {
    // await this.baseService.export2excel(bkTranslate(this.baseService.title()), ALL_SUBJECT_FIELDS);
    console.log('export is not implemented yet');
  }

  public async copyEmailAddresses(): Promise<void> {
    const _allEmails = this.baseService.filteredItems().map(_subject => (_subject as SubjectModel).fav_email);
    const _emails = _allEmails.filter(e => e); // this filters all empty emails, because '' is a falsy value
    await this.copy(_emails.toString(), '@subject.address.operation.emailCopy.conf');
  }

  public override async add(): Promise<void> {
    const _groupName = await bkPrompt(this.alertController, '@input.orgName.group', 'Name');
    if (_groupName) {
      const _group = new SubjectModel();
      _group.name = _groupName;
      _group.category = OrgType.Group;
      _group.modelType = ModelType.Group;
      await this.baseService.createSubject(_group);
    }
  }

  public async deleteSubject(slidingItem: IonItemSliding, subject: SubjectModel): Promise<void> {
    slidingItem.close();
    await this.baseService.deleteSubject(subject);
  }
}
