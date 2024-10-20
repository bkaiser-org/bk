import { AfterViewInit, Component, computed, model, signal } from '@angular/core';
import { BkCatInputComponent, BkModelInfoComponent, BkNotesComponent, BkSpinnerComponent, BkTagsComponent, BkTextInputComponent } from '@bk/ui';
import { ModelInfo, SectionFormModel, sectionFormModelShape, sectionFormValidations, SectionProperties } from '@bk/models';
import { AbstractFormComponent, ModelListComponent } from '@bk/base';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRow, IonToolbar } from '@ionic/angular/standalone';
import { ButtonAction, ModelType, RoleEnum, RoleEnums, SectionType, SectionTypes, ViewPositions } from '@bk/categories';
import { CategoryNamePipe, SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { SectionTags, copyToClipboard, showToast } from '@bk/util';
import { BkEditorComponent } from '../article/bk-editor';
import { BkEditorToolbar } from '../article/editor-toolbar';
import { AccordionSectionFormComponent } from '../accordion/accordion-section.form';
import { VideoSectionFormComponent } from '../video/video.form';
import { MapSectionFormComponent } from '../map/map.form';
import { ArticleSectionFormComponent } from '../article/article-section.form';
import { ButtonSectionFormComponent } from '../button/button-section.form';
import { PeopleListFormComponent } from '../people-list/people-list.form';
import { IframeSectionFormComponent } from "../iframe/iframe.form";
import { vestForms } from 'ngx-vest-forms';
import { ImageConfigFormComponent } from './image-config.form';
import { ImageListFormComponent } from "./image-list.form";
import { SingleImageFormComponent } from "./image.form";
import { AlbumFormComponent } from "../album/album-section.form";
import { TableSectionFormComponent } from '../table/table-section.form';
import { newButton, newIcon } from '../button/button-section.util';
import { newTable } from '../table/table-section.util';

@Component({
  selector: 'bk-section-form',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, CategoryNamePipe, vestForms, SvgIconPipe,
    BkTagsComponent, BkNotesComponent, BkSpinnerComponent, BkModelInfoComponent, BkTextInputComponent,
    ButtonSectionFormComponent, BkCatInputComponent, ImageConfigFormComponent, SingleImageFormComponent,
    ModelListComponent, BkEditorComponent, IframeSectionFormComponent, ImageListFormComponent,
    AccordionSectionFormComponent, MapSectionFormComponent, TableSectionFormComponent,
    VideoSectionFormComponent, ArticleSectionFormComponent, PeopleListFormComponent,
    IonToolbar, IonButton, IonGrid, IonRow, IonCol, IonLabel, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem,
    ImageListFormComponent,
    SingleImageFormComponent,
    AlbumFormComponent
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
              <ion-card-title>{{ '@content.section.forms.title' | translate | async }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-item lines="none">
                <ion-label>{{ '@content.section.default.type' | translate | async }}: {{ vm.type | categoryName:STS }}</ion-label>
              </ion-item>
              <ion-item lines="none">
                <ion-label>Section Key: {{ vm.bkey }}</ion-label>
                &nbsp;<ion-icon src="{{'copy-outline' | svgIcon }}" (click)="copy()" />
              </ion-item>
              <bk-text-input name="name" [value]="vm.name ?? ''" (changed)="updateField('name', $event)" [showHelper]=true />
              <bk-cat-input name="roleNeeded" [value]="vm.roleNeeded ?? role.Registered" [categories]="roles" (changed)="updateField('roleNeeded', $event)" [readOnly]="readOnly()" />
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>

      <!-- section specific settings must be defined within ion-row -->
      @switch(vm.type) {
        @case(ST.Album) {                                             <!-- 0: Album -->
          <bk-album-config-form [vm]="vm" (changedProperties)="onPropertiesChange($event)" />
          <bk-image-config-form [vm]="vm" (changedProperties)="onPropertiesChange($event)" />
        }
        @case(ST.Article) {                                           <!-- 1: Article -->
          <bk-single-image-form [vm]="vm" (positionChange)="onPositionChange($event)" (changedProperties)="onPropertiesChange($event)" />
          <bk-article-section-form [vm]="vm" (contentChange)="onContentChange($event)" />
        }
        <!-- tbd: ChartSectionForm is not yet implemented -->         <!-- 2: Chart -->

        @case(ST.Gallery) {                                             <!-- 3: Gallery -->
          <bk-image-list-form [vm]="vm" (changedProperties)="onPropertiesChange($event)" />
          <bk-image-config-form [vm]="vm" (changedProperties)="onPropertiesChange($event)" />
        }
                       
        @case(ST.Hero) {                                              <!-- 4: Hero -->
          <ion-row>
            <ion-col size="12">
              <ion-label>{{ '@content.section.forms.imageConfig.heroInfo' | translate | async }}</ion-label>
            </ion-col>
          </ion-row>
          <bk-image-list-form [vm]="vm" (changedProperties)="onPropertiesChange($event)" />
        }
        @case(ST.Map) {                                               <!-- 5: Map -->
          <bk-map-section-form [vm]="vm" />
        }
        @case(ST.PeopleList) {                                        <!-- 6: PeopleList -->
          <bk-people-list-form [vm]="vm"  (positionChange)="onPositionChange($event)" (contentChange)="onContentChange($event)" (changedProperties)="onPropertiesChange($event)" />
        }
        @case(ST.Slider) {                                             <!-- 7: Slider -->
          <bk-image-list-form [vm]="vm" (changedProperties)="onPropertiesChange($event)" />
          <bk-image-config-form [vm]="vm" (changedProperties)="onPropertiesChange($event)" />
        }
        <!-- tbd: ListSectionForm is not yet implemented -->          <!-- 8: List -->
        @case(ST.Video) {                                             <!-- 9: Video -->
          <bk-video-section-form [vm]="vm" />
        }
                                                                      <!-- 10: unused Section -->
        <!-- tbd: CalendarSectionForm is not yet implemented -->      <!-- 11: Calendar -->
        @case(ST.Model) {                                             <!-- 12: Model -->
          <bk-model-info 
            [modelInfo]="vm.properties?.modelInfo ?? {bkey: '', modelType: MT.Subject, visibleAttributes: []}" 
            (modelInfoChanged)="onModelInfoChanged($event)" />
        }
        @case(ST.Button) {                                            <!-- 13: Button -->
          <bk-button-section-form [vm]="vm" 
            (changedProperties)="onPropertiesChange($event)" 
            (changedContent)="onContentChange($event)"
            (changedPosition)="onPositionChange($event)"
            (changedAction)="onActionChange($event)"
            (changedUrl)="updateField('url', $event)"
           />
        }
        @case(ST.Table) {                                             <!-- 14: Table -->
          <bk-table-section-form [table]="table()!" (changedProperties)="onPropertiesChange($event)" />  
        }
        @case(ST.Iframe) {                                            <!-- 15: Iframe -->           
          <bk-iframe-section-form [vm]="vm" (changedProperties)="onPropertiesChange($event)" (changedUrl)="updateField('url', $event)" />
        }
        @case(ST.Accordion) {                                         <!-- 16: Accordion -->
            <bk-accordion-section-form [vm]="vm" (changedProperties)="onPropertiesChange($event)" />
        }
      }

      <!---------------------------------------------------
      TAG, NOTES 
      --------------------------------------------------->
      @if(authorizationService.isPrivileged()) {                <!-- tags -->
        <ion-row>                       
          <ion-col>
            <bk-tags storedTags="{{vm.tags}}" [allTags]="sectionTags" (changedTags)="onTagsChanged($event)" />
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
export class SectionFormComponent extends AbstractFormComponent implements AfterViewInit {
  public vm = model.required<SectionFormModel>();
  public table = computed(() => this.vm().properties?.table ?? newTable());
  public icon = computed(() => this.vm().properties?.icon ?? newIcon());
  public button = computed(() => this.vm().properties?.button ?? newButton()); 

  protected readonly suite = sectionFormValidations;
  protected readonly formValue = signal<SectionFormModel>({});
  protected shape = sectionFormModelShape;
  protected readonly errors = signal<Record<string, string>>({ });

  public viewPositions = ViewPositions;
  public STS = SectionTypes;
  public ST = SectionType;
  protected MT = ModelType;
  protected sectionTags = SectionTags;
  protected toolbar = BkEditorToolbar;
  protected role = RoleEnum;
  protected roles = RoleEnums;

  ngAfterViewInit() {
    this.resetForm();
  }

  public clearAll(): void {
    this.vm().name = '';
    this.vm().url = '';
    this.vm().content = '';
    this.vm().tags = '';
    this.vm().notes = '';
    this.formDirty.set(true);
    this.notifyState();
  }

  protected onPropertiesChange(properties: SectionProperties) {
    if (!properties)  return;
    this.updateSectionProperties(properties);
  }

  public onModelInfoChanged(modelInfo: ModelInfo): void {
    const _properties = this.vm().properties;
    if (!_properties)  return;
    _properties.modelInfo = modelInfo;
    this.formDirty.set(true);
    this.notifyState();
  }

  protected onContentChange(newContent: string): void {
    this.updateField('content', newContent ?? '');
  }

  protected onPositionChange(newPosition: number): void {
    this.updateField('imagePosition', newPosition);
  }

  protected onActionChange(newAction: ButtonAction): void {
    const _button = this.vm().properties?.button;
    if (!_button)  return;
    _button.buttonAction = newAction;
    this.formDirty.set(true);
    this.notifyState();
  }

  public copy(): void {
    copyToClipboard(this.vm().bkey);
    showToast(this.toastController, '@general.operation.copy.conf', this.env.settingsDefaults.toastLength);  
  }
}
