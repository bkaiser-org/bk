import { Component, OnInit, inject } from '@angular/core';
import { CollectionNames, EventTags } from '@bk/util';
import { AvatarPipe, BkCatComponent, BkSearchbarComponent, BkSingleTagComponent, BkSpinnerComponent } from '@bk/ui';
import { FullNamePipe, IsSortedPipe, SortDirectionPipe, SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonRow, IonTitle, IonToolbar ,IonPopover ,IonList, IonItemSliding, IonItemOptions, IonItemOption, IonAvatar, IonImg } from '@ionic/angular/standalone';
import { BaseModelListComponent } from '@bk/base';
import { AsyncPipe } from '@angular/common';
import { ListType } from '@bk/categories';
import { EventAllService } from './event-all.service';
import { EventModel } from '@bk/models';
import { EventDurationPipe } from './event-duration.pipe';

@Component({
    selector: 'bk-event-all-list',
    standalone: true,
    imports: [
      TranslatePipe, FullNamePipe, IsSortedPipe, SortDirectionPipe, AsyncPipe, AvatarPipe, EventDurationPipe, SvgIconPipe,
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
        @if(authorizationService.isPrivilegedOr('eventAdmin')) {
          <ion-button (click)="editEvent()" id="tooltip-add">
            <ion-icon slot="icon-only" src="{{'add-circle-outline' | svgIcon }}" />
          </ion-button>
          <ion-popover trigger="tooltip-add" triggerAction="context-menu">
            <ng-template>
              <ion-content class="ion-padding">{{ '@tooltips.add' + baseService.slug() | translate | async}}</ion-content>
            </ng-template>
          </ion-popover>
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
            <bk-single-tag (selectedTag)="onTagSelected($event)" [tags]="eventTags" />
          </ion-col>
          <ion-col size="6" size-md="3">
<!--             <bk-cat [config]="baseService.categoryConfig()!" (ionChange)="onCategoryChange($event)" />
 -->          </ion-col>  
        </ion-row>
      </ion-grid>
    </ion-toolbar>
    <ion-toolbar color="primary">
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6">
            <ion-button (click)="baseService.sort(SF.Name)" fill="clear">
              @if(baseService.currentSortCriteria() | isSorted:SF.Name) {
                <ion-icon color="light" slot="end" src="{{ baseService.currentSortCriteria().direction | sortDirection }}" />
              }
            <ion-label color="light"><strong>{{ '@event.list.header.name' | translate | async }}</strong></ion-label>
            </ion-button>
          </ion-col>
          <ion-col size="12" size-md="6">
            <ion-item color="primary" lines="none">
              <ion-label><strong>{{ '@event.list.header.duration' | translate | async }}</strong></ion-label>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-toolbar>
  </ion-header>
  <ion-content #content>
    @if(getEvents(); as events) {
        @for(event of events; track event.bkey) {
          <ion-item-sliding #slidingItem>
            <ion-item (click)="editEvent(event)">
              <ion-label>{{event.name}}</ion-label>      
              <ion-label>{{ event | eventDuration }}</ion-label>
            </ion-item>
            @if(authorizationService.isPrivilegedOr('eventAdmin')) {
              <ion-item-options side="end">
                <ion-item-option color="danger" (click)="deleteEvent(slidingItem, event)">
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
export class EventAllListComponent extends BaseModelListComponent implements OnInit {
  protected baseService = inject(EventAllService);

  protected listType = ListType.EventAll;
  protected collectionName = CollectionNames.Event;
  protected listRoute = '/event/all';
  protected eventTags = EventTags;

  ngOnInit(): void {
    this.prepareData(this.listType);
  }

  public getEvents(): EventModel[] {
   return this.baseService.filteredItems() as EventModel[];
  }

  public async export(): Promise<void> {
    //await this.baseService.export2excel(bkTranslate(this.baseService.title()), ALL_EVENT_FIELDS);
    console.log('export ist not yet implemented');  
  }

  public async deleteEvent(slidingItem: IonItemSliding, subject: EventModel): Promise<void> {
    slidingItem.close();
    await this.baseService.deleteEvent(subject);
  }

  public async editEvent(event?: EventModel): Promise<void> {
    await this.baseService.editEvent(event);
  }
}

