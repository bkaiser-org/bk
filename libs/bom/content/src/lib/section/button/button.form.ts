import { Component, model, output } from '@angular/core';
import { Button } from '@bk/models';
import { BkCatInputComponent, BkNumberInputComponent, BkStringSelectComponent, BkTextInputComponent, sizeMask } from '@bk/ui';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { ColorsIonic } from '@bk/categories';

@Component({
  selector: 'bk-button-form',
  standalone: true,
  imports: [
    IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle,
    BkCatInputComponent, BkTextInputComponent, BkNumberInputComponent, BkStringSelectComponent
  ],
  template: `
    @if(button(); as button) {
      <ion-row>
        <ion-col size="12"> 
          <ion-card>
            <ion-card-header>
              <ion-card-title>Button - Konfiguration</ion-card-title>
              <ion-card-subtitle>Definiere wie der Button aussehen soll.</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <ion-grid>
                <ion-row>
                  <ion-col size="12" size-md="6">                            <!-- button label -->           
                    <bk-text-input name="buttonLabel" [value]="button.label!" (changed)="onButtonChanged('label', $event)" [showHelper]=true />
                  </ion-col>
                  <ion-col size="12" size-md="6">                                <!-- color -->
                    <bk-cat-input name="color" [value]="button.color!" [categories]="colorsIonic" (changed)="onButtonChanged('color', $event)" />
                  </ion-col>
                  <ion-col size="12" size-md="6">                            <!-- button shape --> 
                    <bk-string-select name="buttonShape"  [selectedString]="button.shape ?? 'default'"
                      [stringList] = "['default', 'round']" (changed)="onButtonChanged('shape', $event)" />
                  </ion-col>
                  <ion-col size="12" size-md="6">                            <!-- button fill -->
                    <bk-string-select name="buttonFill" [selectedString]="button.fill ?? 'default'"
                      [stringList] = "['default', 'clear', 'outline', 'solid']" (changed)="onButtonChanged('fill', $event)" />
                  </ion-col>
                  <ion-col size="12" size-md="6">                            <!-- button width -->
                    <bk-text-input name="buttonWidth" [value]="button.width ?? ''" (changed)="onButtonChanged('width', $event)" [mask]="sizeMask" [maxLength]=3 [showHelper]=true [showError]=true />                             
                  </ion-col>
                  <ion-col size="12" size-md="6">                            <!-- button height -->           
                    <bk-text-input name="buttonHeight" [value]="button.height ?? ''" (changed)="onButtonChanged('height', $event)" [mask]="sizeMask" [maxLength]=3 [showHelper]=true [showError]=true />                             
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
  public button = model.required<Button>();

  protected colorsIonic = ColorsIonic;
  protected sizeMask = sizeMask;

  public changedButton = output<Button>();

  protected onButtonChanged(fieldName: keyof Button, value: string | boolean | number) {
    this.button.update((_button) => ({ ..._button, [fieldName]: value }));
    this.changedButton.emit(this.button());
  }
}
