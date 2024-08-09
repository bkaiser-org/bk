import { Component, computed, input, model, output } from '@angular/core';
import { IonButton, IonCol, IonGrid, IonInput, IonRow, ItemReorderEventDetail } from '@ionic/angular/standalone';
import { arrayMove } from '@bk/util';
import { FormsModule } from '@angular/forms';
import { BkCatComponent } from '../category/bk-cat/bk-cat';
import { BkStringsComponent } from './bk-strings';
import { Category, ModelType, ModelTypes } from '@bk/categories';
import { ModelInfo } from '@bk/models';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MaskitoElementPredicateAsync, MaskitoOptions } from '@maskito/core';
import { TranslatePipe } from '@bk/pipes';
import { MaskitoModule } from '@maskito/angular';
import { caseInsensitiveWordMask } from '../form-widgets/bk-text-input';

@Component({
  selector: 'bk-model-info',
  standalone: true,
  imports: [
    FormsModule, MaskitoModule,
    JsonPipe, TranslatePipe, AsyncPipe,
    BkCatComponent, BkStringsComponent,
    IonButton, IonGrid, IonRow, IonCol, IonInput
  ],
  template: `
    <ion-row>
      <ion-col size="12">
        <ion-grid>
          <ion-row>
            <ion-col size="12" size-md="6">                               <!-- modelType -->
              <bk-cat [config]="config()" (ionChange)="onModelTypeChange($event)" />
            </ion-col>
            <ion-col size="12" size-md="6">                              <!-- bkey -->     
              <ion-input [ngModel]="modelInfo().bkey"
                label="{{ label() | translate | async }}"
                labelPlacement="floating"
                inputMode="text"
                type="text"
                [counter]="true"
                [maxlength]="20"
                placeholder="{{ placeholder() | translate | async }}"
                [clearInput]="true"
                [readonly]="readOnly()"
                errorText="{{errorText() | translate | async }}"
                helperText="{{helperText() | translate | async }}"
                (ionChange)="onKeyChange($event)"
                [maskito]="wordMask()"
                [maskitoElement]="maskPredicate" />
            </ion-col>
          </ion-row>
          <ion-row>
              <ion-col size="12">                                        <!-- visibleAttributes: string[] -->
                <bk-strings [strings]="modelInfo().visibleAttributes!" 
                  (stringsChanged)="onVisibleAttributesChange()" 
                  title="@input.modelInfo.attributes.label" 
                  addLabel="@input.modelInfo.attributes.add" />
              </ion-col>
            </ion-row>
        </ion-grid>
      </ion-col>
    </ion-row>
  `
})
export class BkModelInfoComponent  {
  public modelInfo = model.required<ModelInfo>(); 
  public readOnly = input(false); // if true, the input field is read-only
  public label = input('@input.modelInfo.key.label');
  public placeholder = input('@input.modelInfo.key.placeholder');
  public helperText = input('@input.modelInfo.key.helper');
  public errorText = input('@input.modelInfo.key.error');
  protected wordMask = input<MaskitoOptions>(caseInsensitiveWordMask);
  public modelInfoChanged = output<ModelInfo>();

  public config = computed(() => { 
    return {
      categories: ModelTypes,
      selectedCategoryId: this.modelInfo().modelType ?? ModelType.Subject,
      label: '@categories.modelType.name'
    }
  });

  public onModelTypeChange($event: Event): void {
    const _category = ($event.target as HTMLInputElement).value as unknown as Category;
    this.modelInfo().modelType = _category.id;
    this.modelInfoChanged.emit(this.modelInfo());
  }


  public onVisibleAttributesChange(): void {
    this.modelInfoChanged.emit(this.modelInfo());
  }

  public onKeyChange($event: CustomEvent): void {
    this.modelInfo().bkey = $event.detail.value;
    this.modelInfoChanged.emit(this.modelInfo());
  }

  reorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    arrayMove(this.modelInfo().visibleAttributes, ev.detail.from, ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }

  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();
}
