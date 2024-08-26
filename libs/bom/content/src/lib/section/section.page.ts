import { Component, OnInit, inject, input } from '@angular/core';
import { AuthorizationService } from '@bk/base';
import { AppNavigationService, die } from '@bk/util';
import { ModelType } from '@bk/categories';
import { BkChangeConfirmationComponent, BkHeaderComponent, BkSpinnerComponent } from '@bk/ui';
import { IonAccordionGroup, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { Observable, firstValueFrom, map, of } from 'rxjs';
import { TranslatePipe } from '@bk/pipes';
import { SectionService } from './section.service';
import { SectionFormModel, SectionModel } from '@bk/models';
import { convertFormToSection, convertSectionToForm } from './forms/section.form.util';
import { PreviewModalComponent } from './preview.modal';
import { SectionFormComponent } from './forms/section.form';
import { addIcons } from "ionicons";
import { closeCircleOutline, eyeOutline } from "ionicons/icons";

@Component({
    selector: 'bk-section-page',
    standalone: true,
    imports: [
      TranslatePipe, AsyncPipe,
      BkChangeConfirmationComponent,
      BkSpinnerComponent, SectionFormComponent, BkHeaderComponent,
      IonContent, IonAccordionGroup, IonHeader, IonToolbar, 
      IonTitle, IonButtons, IonButton, IonIcon
    ],
    template: `
      @if(vm$ | async; as vm) {
        <ion-header>
          <ion-toolbar color="secondary">
            <ion-title>{{ '@content.section.operation.update.label' | translate | async }}</ion-title>
            <ion-buttons slot="end">
              <ion-button (click)="previewSection()">
                <ion-icon slot="icon-only" name="eye-outline" />
              </ion-button>
              <ion-button color="light" (click)="cancel()">
                <ion-icon slot="icon-only" name="close-circle-outline" />
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        @if(formCanBeSaved) {
          <bk-change-confirmation [showCancel]="true" (okClicked)="save()" (cancelClicked)="cancel()" />
        } 
        <ion-content>
          <div style="width: 100%">
            <bk-section-form [vm]="vm" (changedData)="onDataChange($event)" (changedFormState)="onFormStateChange($event)" />
          </div>
        </ion-content>
    } @else {
      <bk-header title="" />
      <ion-content>
        <bk-spinner />
      </ion-content>
    }
  `
})
export class SectionPageComponent implements OnInit {
  private modalController = inject(ModalController);
  public sectionService = inject(SectionService);
  public authorizationService = inject(AuthorizationService);
  private appNavigationService = inject(AppNavigationService);

  public id = input.required<string>();

  public currentSection: SectionModel | undefined;
  private originalSection$: Observable<SectionModel | undefined> = of(undefined);
  protected vm$: Observable<SectionFormModel | undefined> = of(undefined);

  protected formCanBeSaved = false;
  public currentForm: SectionFormModel | undefined;
  public MT = ModelType;

  constructor() {
    addIcons({closeCircleOutline, eyeOutline});
  }

  ngOnInit(): void {
    const _sectionKey = this.id();
    if (_sectionKey) {
      this.originalSection$ = this.sectionService.readSection(_sectionKey);
      this.vm$ = this.originalSection$.pipe(map(_section => convertSectionToForm(_section)));
    } else {
      die('SectionPage: sectionKey is mandatory.');
    }
  }

  /**
   * Update the form data.
   * @param form 
   */
  public onDataChange(form: SectionFormModel): void {
    this.currentForm = form;
  }

  /**
   * Update the form state.
   * @param formCanBeSaved 
   */
  public onFormStateChange(formCanBeSaved: boolean): void {
    this.formCanBeSaved = formCanBeSaved;
  }

  /**
   * Save the changes to the section into the database.
   */
  public async save(): Promise<void> {
    const _originalSection = await firstValueFrom(this.originalSection$);
    if (this.currentForm) {
      const _section = convertFormToSection(_originalSection, this.currentForm);
      await this.sectionService.updateSection(_section);
      this.formCanBeSaved = false;
    }
    this.appNavigationService.back();
  }

  public async cancel(): Promise<void> {
    this.appNavigationService.back();
  }

  public async previewSection(): Promise<void> {
    const _originalSection = await firstValueFrom(this.originalSection$);
    if (this.currentForm) {
      const _modal = await this.modalController.create({
        component: PreviewModalComponent,
        cssClass: 'full-modal',
        componentProps: { 
          section: convertFormToSection(_originalSection, this.currentForm)
        }
      });
      _modal.present();
      await _modal.onDidDismiss();
    }
  }
}
