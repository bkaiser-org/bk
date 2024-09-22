import { Component, OnInit, inject } from '@angular/core';
import { TaskModel, isTask } from '@bk/models';
import { CollectionNames } from '@bk/util';
import { BkCatComponent, BkSearchbarComponent, BkSpinnerComponent } from '@bk/ui';
import { CategoryNamePipe, IsSortedPipe, SortDirectionPipe, SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { IonBackdrop, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonMenuButton, IonRow, IonTitle, IonToolbar, ModalController   } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { BaseModelListComponent } from '@bk/base';
import { ListType, TaskStates } from '@bk/categories';
import { TaskAllService } from './task-all.service';
import { TaskModalComponent } from '../task.modal';

@Component({
  selector: 'bk-task-all-list',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, CategoryNamePipe, IsSortedPipe, SortDirectionPipe, SvgIconPipe,
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
      <ion-title>{{ '@task.plural' | translate | async }}</ion-title>
      <ion-buttons slot="end">
        @if(authorizationService.isPrivilegedOr('admin')) {
          <ion-button (click)="editTask()">
            <ion-icon slot="icon-only" src="{{'add-circle-outline' | svgIcon }}" />
          </ion-button>
        }
      </ion-buttons>
    </ion-toolbar>

    <!-- description -->
    <ion-toolbar class="ion-hide-md-down">
      <ion-item lines="none">
        <ion-label>{{ '@task.description' | translate | async }}</ion-label>
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
            <ion-col size="2" class="ion-hide-md-down">
              <ion-label><strong>{{ '@task.list.header.dueDate' | translate | async }}</strong></ion-label>  
            </ion-col>
            <ion-col size="6" size-md="12">
                <ion-label><strong>{{ '@task.list.header.name' | translate | async }}</strong></ion-label>
            </ion-col>
            <ion-col size="2" class="ion-hide-md-down">
                <ion-label><strong>{{ '@task.list.header.assignee' | translate | async }}</strong></ion-label>
            </ion-col>
            <ion-col size="2" class="ion-hide-md-down">
                <ion-label><strong>{{ '@task.list.header.state' | translate | async }}</strong></ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>
    </ion-toolbar>
  </ion-header>

  <!-- Data -->
<ion-content #content>
  @if(getTasks(); as tasks) {
    @if (tasks.length === 0) {
      <ion-toolbar>
      <ion-item>
        <ion-label>{{ '@task.field.empty' | translate | async }}</ion-label>
      </ion-item>
    </ion-toolbar>
    } @else {
      @for(task of tasks; track task.bkey) {
        <ion-item-sliding #slidingItem>
          <ion-item (click)="editTask(slidingItem, task)">
            <ion-label class="ion-hide-md-down">{{ task.dueDate }}</ion-label>
            <ion-label>{{ task.name }}</ion-label>
            <ion-label class="ion-hide-md-down">{{ task.assignee }}</ion-label>
            <ion-label class="ion-hide-md-down">{{ task.category | categoryName:taskStates }}</ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" (click)="deleteTask(slidingItem, task)">
              <ion-icon slot="icon-only" src="{{'trash-outline' | svgIcon }}" />
            </ion-item-option>
            <ion-item-option color="primary" (click)="editTask(slidingItem, task)">
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
export class TaskAllListComponent extends BaseModelListComponent implements OnInit {
  protected baseService = inject(TaskAllService);
  protected listType = ListType.TaskAll;
  protected collectionName = CollectionNames.Task;
  protected listRoute = '/task/all';
  protected modalController = inject(ModalController);

  public taskStates = TaskStates;

  ngOnInit(): void {
    this.prepareData(this.listType);
  }

  public getTasks(): TaskModel[] {
    return this.baseService.filteredItems() as TaskModel[];
  }

  public async editTask(slidingItem?: IonItemSliding, task?: TaskModel): Promise<void> {
    if (slidingItem) slidingItem.close();
    let _task = task;
    if (!_task) {
      _task = new TaskModel();
    }
    const _modal = await this.modalController.create({
      component: TaskModalComponent,
      componentProps: {
        task: _task
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      if (isTask(data)) {
        await (!task) ? this.baseService.createTask(data) : this.baseService.updateTask(data);
      }
    }
  }
  
  public async deleteTask(slidingItem: IonItemSliding, task: TaskModel): Promise<void> {
    slidingItem.close();
    await this.baseService.deleteTask(task);
  }
}



