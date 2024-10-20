import { Component, model, output } from '@angular/core';
import { Icon } from '@bk/models';
import { BkStringSelectComponent, BkTextInputComponent, lowercaseWordMask, sizeMask } from '@bk/ui';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { ColorsIonic } from '@bk/categories';

@Component({
  selector: 'bk-icon-form',
  standalone: true,
  imports: [
    IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle,
    BkTextInputComponent, BkStringSelectComponent
  ],
  template: `
    @if(icon(); as icon) {
      <ion-row>
        <ion-col size="12"> 
          <ion-card>
            <ion-card-header>
              <ion-card-title>Icon - Konfiguration</ion-card-title>
              <ion-card-subtitle>Definiere ein optionales Icon, das im Button dargestellt wird.</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <ion-grid>
                <ion-row>
                  @if(icon.slot !== 'none') {
                  <ion-col size="12" size-md="6">                            <!-- icon name -->           
                    <bk-text-input name="iconName" [value]="icon.name!" [mask]="mask" (changed)="onIconChanged('name', $event)" [showHelper]=true />
                  </ion-col>
                  <ion-col size="12" size-md="6">                            <!-- icon size -->
                    <bk-text-input name="iconSize" [value]="icon.size ?? ''" (changed)="onIconChanged('size', $event)" [mask]="sizeMask" [maxLength]=3 [showHelper]=true [showError]=true />                             
                  </ion-col>
                  }
                  <ion-col size="12" size-md="6">                            <!-- icon position / slot --> 
                    <bk-string-select name="slot"  [selectedString]="icon.slot ?? 'start'"
                      [stringList] = "['start', 'end', 'icon-only', 'none']" (changed)="onIconChanged('slot', $event)" />
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
export class IconFormComponent {
  public icon = model.required<Icon>();

  protected colorsIonic = ColorsIonic;
  protected mask = lowercaseWordMask;
  protected sizeMask = sizeMask;

  public changedIcon = output<Icon>();

  protected onIconChanged(fieldName: keyof Icon, value: string | boolean | number) {
    this.icon.update((_icon) => ({ ..._icon, [fieldName]: value }));
    this.changedIcon.emit(this.icon());
  }
}
