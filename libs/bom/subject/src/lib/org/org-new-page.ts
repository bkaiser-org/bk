import { Component, OnInit, inject } from '@angular/core';
import { OrgNewFormModel } from '@bk/models';
import { BkChangeConfirmationComponent, BkHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { OrgNewFormComponent } from './org-new-form';
import { IonContent } from '@ionic/angular/standalone';
import { SubjectService } from '../subject.service';
import { convertNewFormToOrg, getOrgNewFormModel } from './org-new-form.util';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { AppNavigationService } from '@bk/util';

@Component({
  selector: 'bk-org-new-page',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    OrgNewFormComponent, 
    BkSpinnerComponent, BkHeaderComponent, BkChangeConfirmationComponent,
    IonContent
  ],
  template: `
  <bk-header title="{{ '@subject.org.operation.create.label' | translate | async }}" />
  @if(formCanBeSaved) {
    <bk-change-confirmation (okClicked)="save()" />
  }
  <ion-content>
    @if(vm) {
      <bk-org-new-form [vm]="vm" (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)" />
    } @else {
      <bk-spinner />
    }
  </ion-content>
  `
})
export class OrgNewPageComponent implements OnInit {
  private subjectService = inject(SubjectService);
  private appNavigationService = inject(AppNavigationService);

  protected formCanBeSaved = false;
  public currentForm: OrgNewFormModel | undefined;
  public vm!: OrgNewFormModel;

  ngOnInit(): void {
    this.vm = getOrgNewFormModel();
  }

  public onDataChange(form: OrgNewFormModel): void {
    this.currentForm = form as OrgNewFormModel;
  }

  public onFormStateChange(formCanBeSaved: boolean): void {
    this.formCanBeSaved = formCanBeSaved;
  }

  public async save(): Promise<void> {
    if (this.currentForm) {
      await this.subjectService.createSubject(convertNewFormToOrg(this.currentForm));
    }
    this.appNavigationService.back();
  }
}
