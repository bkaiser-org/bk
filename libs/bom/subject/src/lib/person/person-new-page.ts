import { Component, computed, inject, input } from '@angular/core';
import { OrgKey } from '@bk/categories';
import { PersonNewFormModel } from '@bk/models';
import { BkChangeConfirmationComponent, BkHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { PersonNewFormComponent } from './person-new-form';
import { IonContent } from '@ionic/angular/standalone';
import { SubjectService } from '../subject.service';
import { convertNewFormToMembership, convertNewFormToPerson, getPersonNewFormModel } from './person-new-form.util';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { AppNavigationService } from '@bk/util';

@Component({
  selector: 'bk-person-new-page',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    PersonNewFormComponent, 
    BkSpinnerComponent, BkHeaderComponent, BkChangeConfirmationComponent,
    IonContent
  ],
  template: `
    <bk-header title="{{ title() | translate | async }}" />
    @if(formCanBeSaved) {
      <bk-change-confirmation (okClicked)="save()" />
    }
    <ion-content>
      @if(vm(); as vm) {
        <bk-person-new-form [vm]="vm" (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)" />
      } @else {
        <bk-spinner />
      }
    </ion-content>
  `
})
export class PersonNewPageComponent {
  private subjectService = inject(SubjectService);
  private appNavigationService = inject(AppNavigationService);

  public orgId = input<string>();
  protected vm = computed(() => getPersonNewFormModel(this.orgId()));
  protected title = computed(() => this.getPersonNewTitle(this.orgId()));

  protected formCanBeSaved = false;
  public currentForm: PersonNewFormModel | undefined;

  public onDataChange(form: PersonNewFormModel): void {
    this.currentForm = form;
  }

  public onFormStateChange(formCanBeSaved: boolean): void {
    this.formCanBeSaved = formCanBeSaved;
  }

  public async save(): Promise<void> {
    if (this.currentForm) {
      this.subjectService.createSubject(convertNewFormToPerson(this.currentForm), convertNewFormToMembership(this.currentForm));
    }
    this.appNavigationService.back();
  }

  private getPersonNewTitle(orgId: string | undefined): string {
    if (!orgId || orgId.length === 0) return '@subject.person.operation.create.label';
    return orgId === OrgKey.SCS ? '@member.operation.create.SCS' : '@member.operation.create.label';
  }
}
