import { AfterViewInit, Component, computed, inject, model, signal } from '@angular/core';
import { BkCatInputComponent, BkModelInfoComponent, BkNotesComponent, BkSpinnerComponent, BkStringsComponent, BkTagsComponent, BkTextInputComponent, caseInsensitiveWordMask } from '@bk/ui';
import { AbstractFormComponent } from '@bk/base';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRow, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { CategoryNamePipe, SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { vestForms } from 'ngx-vest-forms';
import { PageFormModel, pageFormModelShape, pageFormValidations } from '@bk/models';
import { copyToClipboard, PageTags, showToast } from '@bk/util';
import { Router } from '@angular/router';

@Component({
  selector: 'bk-page-form',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, CategoryNamePipe, vestForms, SvgIconPipe,
    BkTagsComponent, BkNotesComponent, BkSpinnerComponent, BkModelInfoComponent, BkTextInputComponent,
    BkCatInputComponent, BkStringsComponent,
    IonToolbar, IonButton, IonGrid, IonRow, IonCol, IonLabel, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem,
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
        CONTENT 
        --------------------------------------------------->
        <ion-row>
          <ion-col size="12">
            <ion-card>
              <ion-card-header>
                <ion-card-title>{{ '@content.page.forms.title' | translate | async }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-item lines="none">
                  <ion-icon src="{{'enter-outline' | svgIcon }}" (click)="gotoPage(vm.bkey)" slot="start"/>
                  <ion-label>{{ 'Page Key: '}} {{ vm.bkey }}</ion-label>
                  <ion-icon src="{{'copy-outline' | svgIcon }}" (click)="copy()" slot="end"/>
                </ion-item>
                <bk-text-input name="name" [value]="vm.name ?? ''" (changed)="updateField('name', $event)" [showHelper]=true />
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12">
            <bk-strings [strings]="sections()!" [mask]="mask" [maxLength]="40" (stringsChanged)="onSectionsChange($event)" title="{{ '@content.page.forms.section.label' | translate | async }}" addLabel="Neue Sektion hinzufügen" />
          </ion-col>
        </ion-row>

        <!---------------------------------------------------
        TAG, NOTES 
        --------------------------------------------------->
        @if(authorizationService.isPrivileged()) {                <!-- tags -->
          <ion-row>                       
            <ion-col>
              <bk-tags storedTags="{{vm.tags}}" [allTags]="pageTags" (changedTags)="onTagsChanged($event)" />
            </ion-col>
          </ion-row>
        }
        @if(authorizationService.isAdmin()) {                     <!-- notes -->
          <ion-row>
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
export class PageFormComponent extends AbstractFormComponent implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly modalController = inject(ModalController);

  public vm = model.required<PageFormModel>();
  protected sections = computed(() => this.vm().sections) ?? [];

  protected readonly suite = pageFormValidations;
  protected readonly formValue = signal<PageFormModel>({});
  protected shape = pageFormModelShape;
  protected readonly errors = signal<Record<string, string>>({ });
  protected pageTags = PageTags;
  protected mask = caseInsensitiveWordMask;

  ngAfterViewInit() {
    this.resetForm();
  }

  public clearAll(): void {
    this.vm().name = '';
    this.vm().tags = '';
    this.vm().notes = '';
    this.formDirty.set(true);
    this.notifyState();
  }

  public copy(): void {
    copyToClipboard(this.vm().bkey);
    showToast(this.toastController, '@general.operation.copy.conf', this.env.settingsDefaults.toastLength);  
  }

  protected onSectionsChange(changedSections: string[]): void {
    this.vm.update((_vm) => ({..._vm, 'sections': changedSections}));
  }

  protected gotoPage(pageKey?: string): void {
    if (!pageKey)  return;
    this.modalController.dismiss(null, 'cancel');
    this.router.navigateByUrl(`/private/${pageKey}`);
  }
}
