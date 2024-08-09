import { Component, OnInit, inject } from '@angular/core';
import { ResourceType } from '@bk/categories';
import { FormModel, ResourceNewFormModel } from '@bk/models';
import { ResourceNewFormComponent } from './resource-new-form';
import { IonContent } from '@ionic/angular/standalone';
import { BkChangeConfirmationComponent, BkHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { ResourceService } from './resource.service';
import { convertNewFormToResource, getResourceNewFormModel } from './resource-new-form.util';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { AppNavigationService } from '@bk/util';

@Component({
  selector: 'bk-resource-new-page',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, 
    ResourceNewFormComponent, 
    BkHeaderComponent, BkChangeConfirmationComponent, BkSpinnerComponent,
    IonContent
  ],
  template: `
    <bk-header title="{{ '@resource.other.operation.create.label' | translate | async }}" />
    @if(formCanBeSaved) {
      <bk-change-confirmation (okClicked)="save()" />
    }
    <ion-content>
      @if(vm) {
        <bk-resource-new-form [vm]="vm" (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)" />
      } @else {
        <bk-spinner />
      }
    </ion-content>
  `
})
export class ResourceNewPageComponent implements OnInit {
  public resourceService = inject(ResourceService);
  private appNavigationService = inject(AppNavigationService);

  protected formCanBeSaved = false;
  public currentForm: ResourceNewFormModel | undefined;
  public vm!: ResourceNewFormModel

  ngOnInit() {
    this.vm = getResourceNewFormModel(this.resourceService.modelType(), this.resourceService.type() as ResourceType);
  }

  public onDataChange(form: FormModel): void {
    this.currentForm = form as ResourceNewFormModel;
  }

  public onFormStateChange(formCanBeSaved: boolean): void {
    this.formCanBeSaved = formCanBeSaved;
  }

  public async save(): Promise<void> {
    if (this.currentForm) {
      this.resourceService.createResource(convertNewFormToResource(this.currentForm));
    }
    this.appNavigationService.back();
  }
}
