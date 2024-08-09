import { AfterViewInit, Component, OnInit, inject, model, signal } from '@angular/core';
import { IonAvatar, IonCol, IonGrid, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonRow, ModalController } from '@ionic/angular/standalone';
import { AbstractFormComponent, BkModelSelectComponent, DataService } from '@bk/base';
import { AvatarPipe, BkCatInputComponent, BkDateInputComponent, BkNotesComponent, BkSpinnerComponent, BkTagsComponent, BkTextInputComponent } from '@bk/ui';
import { SubjectModel, TaskFormModel, isSubject, taskFormModelShape, taskFormValidations } from '@bk/models';
import { CollectionNames, TaskTags } from '@bk/util';
import { FullNamePipe, TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { Importances, ListType, ModelType, Priorities, TaskState, TaskStates } from '@bk/categories';
import { Observable, firstValueFrom } from 'rxjs';
import { vestForms } from 'ngx-vest-forms';

@Component({
  selector: 'bk-task-form',
  standalone: true,
  imports: [
    vestForms,
    TranslatePipe, AsyncPipe, AvatarPipe, FullNamePipe,
    BkTextInputComponent, BkDateInputComponent, BkCatInputComponent, BkTagsComponent, BkNotesComponent, BkSpinnerComponent,
    IonGrid, IonRow, IonCol, IonInput, IonLabel, IonIcon, IonAvatar, IonImg, IonItem
  ],
  template: `
  @if(vm(); as vm) {
  <form scVestForm
    [formShape]="shape"
    [formValue]="formValue()"
    [suite]="suite" 
    (formValueChange)="formValue.set($event)">

    <ion-grid>
      <!---------------------------------------------------
        Latitude, Longitude, PlaceId, What3Words, Height, Speed, Direction 
        --------------------------------------------------->
      <ion-row>
        <ion-col size="12">                                               <!-- name -->
          <bk-text-input name="name" [value]="vm.name!" (changed)="updateField('name', $event)" [autofocus]="true" [maxLength]=30 [showError]=true [readOnly]="readOnly()" />                                        
        </ion-col>
      </ion-row>
      <ion-row>                                                         
        <ion-col size="12" size-md="6">                                  <!-- taskState -->
          <bk-cat-input name="taskState" [value]="vm.taskState ?? taskState.Initial" [categories]="taskStates" (changed)="updateField('taskState', $event)" [readOnly]="readOnly()" />                                                   
        </ion-col>

        <ion-col size="12" size-md="6">                                 <!-- dueDate -->
          <bk-date-input name="dueDate" [storeDate]="vm.dueDate!" (changed)="updateField('dueDate', $event)" [showError]=true [showHelper]=true [readOnly]="readOnly()" />
        </ion-col>

        <ion-col size="12" size-md="6">                                 <!-- priority -->
          <bk-cat-input name="priority" [value]="vm.priority!" [categories]="priorities" (changed)="updateField('priority', $event)" [readOnly]="readOnly()" />                                                   
        </ion-col>

        <ion-col size="12" size-md="6">                                 <!-- importance -->
          <bk-cat-input name="importance" [value]="vm.importance!" [categories]="importances" (changed)="updateField('importance', $event)" [readOnly]="readOnly()" />                                                   
        </ion-col>

        <ion-col size="12" size-md="6"> 
          <ion-item lines="none">                                        <!-- assignee label -->
            <ion-icon name="search" (click)="selectPerson()" slot="start" /> 
            <ion-label>{{ '@task.list.header.assignee' | translate | async }}</ion-label>
          </ion-item>
        </ion-col>

        <ion-col size="12" size-md="6"> 
          <ion-item lines="none">                                        <!-- assignee -->
            <ion-avatar slot="start">
              <ion-img src="{{ MT.Person + '.' + vm.assignee | avatar | async }}" alt="Avatar Logo" />
            </ion-avatar>
            @if(assignee) {
              <ion-label>{{ assignee.name | fullName:assignee.firstName }}</ion-label>
            } @else {
              <ion-label>undefined</ion-label>
            }
          </ion-item>
        </ion-col>
      </ion-row>

      <!-- 
      tbd:
      - extract tags from name
      - due date may contain any string (make it a string field with a leading date picker button)
      -->

      <!---------------------------------------------------
        TAG, NOTES 
        --------------------------------------------------->
      @if(authorizationService.isPrivileged()) {
        <ion-row>                                                                        <!-- tags -->
          <ion-col>
            <bk-tags storedTags="{{vm.tags}}" [allTags]="taskTags" (changedTags)="onTagsChanged($event)" [readOnly]="readOnly()" />
          </ion-col>
        </ion-row>
      }

      @if(authorizationService.isAdmin()) {
        <ion-row>                                                                       <!-- notes -->
          <ion-col>
          <bk-notes [value]="vm.notes ?? ''" (changed)="updateField('notes', $event)" />
          </ion-col>
        </ion-row>    
      }
    </ion-grid>
  </form>
} @else {
  <bk-spinner />
}
`
})
export class TaskFormComponent extends AbstractFormComponent implements AfterViewInit, OnInit {
  protected modalController = inject(ModalController);
  private dataService = inject(DataService);
  public vm = model.required<TaskFormModel>();

  protected readonly suite = taskFormValidations;
  protected readonly formValue = signal<TaskFormModel>({});
  protected readonly shape = taskFormModelShape;
  protected readonly errors = signal<Record<string, string>>({ });

  protected assignee: SubjectModel | undefined = undefined;
  public MT = ModelType;
  protected taskTags = TaskTags;
  protected importances = Importances;
  protected priorities = Priorities;
  protected taskState = TaskState;
  protected taskStates = TaskStates;
  
  async ngOnInit() {
    if (this.vm().assignee) {
      this.assignee = await firstValueFrom(this.dataService.readModel(CollectionNames.Person, this.vm().assignee) as Observable<SubjectModel | undefined>); 
    } else {
      this.assignee = undefined;
    }
  }

  ngAfterViewInit() {
    this.resetForm();
  }

  /**
   * Show a modal to select a person as the assignee of this task.
   */
  public async selectPerson(): Promise<void> {
    const _modal = await this.modalController.create({
      component: BkModelSelectComponent,
      componentProps: {
        bkListType: ListType.PersonAll
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      if (isSubject(data)) {
        this.vm().assignee = data.bkey;
        this.assignee = data;
      }
    }
  }
}