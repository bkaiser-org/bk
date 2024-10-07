import { Component, computed, model, output } from '@angular/core';
import { Button, SectionFormModel, SectionProperties } from '@bk/models';
import { BkCatInputComponent, BkNumberInputComponent, BkStringSelectComponent, BkTextInputComponent, sizeMask } from '@bk/ui';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { ColorIonic, ColorsIonic } from '@bk/categories';
import { error, stripPostfix } from '@bk/util';

@Component({
  selector: 'bk-button-config-form',
  standalone: true,
  imports: [
    IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    BkCatInputComponent, BkTextInputComponent, BkNumberInputComponent, BkStringSelectComponent
  ],
  template: `
    @if(vm(); as vm) {
      <ion-row>
        <ion-col size="12"> 
          <ion-card>
            <ion-card-header>
              <ion-card-title>Button</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-grid>
                <ion-row>
                  <ion-col size="12">                            <!-- button label -->           
                    <bk-text-input name="buttonLabel" [value]="vm.properties!.button!.label!" (changed)="onButtonPropertyChanged('label', $event)" [showHelper]=true />
                  </ion-col>
                  <ion-col size="12" size-md="6">                            <!-- button shape --> 
                    <bk-string-select name="buttonShape"  [selectedString]="vm.properties!.button!.shape ?? 'default'"
                      [stringList] = "['default', 'round']" (changed)="onButtonPropertyChanged('shape', $event)" />
                  </ion-col>
                  <ion-col size="12" size-md="6">                            <!-- button fill -->
                    <bk-string-select name="buttonFill" [selectedString]="vm.properties!.button!.fill ?? 'default'"
                      [stringList] = "['default', 'clear', 'outline', 'solid']" (changed)="onButtonPropertyChanged('fill', $event)" />
                  </ion-col>
                  <ion-col size="12" size-md="6">                            <!-- button width -->
                    <bk-text-input name="buttonWidth" [value]="buttonWidth()" (changed)="onButtonPropertyChanged('width', $event)" [mask]="sizeMask" [maxLength]=3 [showHelper]=true [showError]=true />                             
                  </ion-col>
                  <ion-col size="12" size-md="6">                            <!-- button height -->           
                    <bk-text-input name="buttonHeight" [value]="buttonHeight()" (changed)="onButtonPropertyChanged('height', $event)" [mask]="sizeMask" [maxLength]=3 [showHelper]=true [showError]=true />                             
                  </ion-col>
                  <ion-col size="12" size-md="6">                                <!-- color -->
                    <bk-cat-input name="color" [value]="vm.color!" [categories]="colorsIonic" (changed)="onButtonPropertyChanged('color', $event)" />
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    }
  `
})
export class ButtonFormComponent {
  public vm = model.required<SectionFormModel>();
  protected buttonWidth = computed(() => stripPostfix(this.vm().properties?.button?.width ?? '200', 'px'));
  protected buttonHeight = computed(() => stripPostfix(this.vm().properties?.button?.height ?? '60', 'px'));

  protected colorsIonic = ColorsIonic;
  protected sizeMask = sizeMask;

  public changedProperties = output<SectionProperties>();

  protected onButtonPropertyChanged(fieldName: keyof Button, value: string | boolean | number) {
    const _config = this.vm().properties?.button ?? {
      label: '',
      shape: 'round',
      fill: 'clear',
      width: '200',
      height: '60',
      color: ColorIonic.Primary,
    };
    switch (fieldName) {
      case 'label': _config.label = value as string; break;
      case 'shape': _config.shape = value as string; break;
      case 'fill': _config.fill = value as string; break;
      case 'width': _config.width = value as string + 'px'; break;
      case 'height': _config.height = value as string + 'px'; break;
      case 'color': _config.color = value as number; break;
      default: error(undefined, `BkButtonSectionForm.onButtonPropertyChanged: unknown field ${fieldName}`); return;
    }
    const _properties = this.vm().properties;
    if (_properties) {
      _properties.button = _config;
    }
    this.changedProperties.emit({
      button: _config
    });
  }
}
