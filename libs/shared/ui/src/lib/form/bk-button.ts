import { Component, input } from '@angular/core';
import { IonButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { ColorIonic, ColorsIonic } from '@bk/categories';
import { CategoryPlainNamePipe } from '@bk/pipes';
import { addIcons } from "ionicons";
import { checkmarkCircleOutline, helpOutline } from "ionicons/icons";

@Component({
  selector: 'bk-button',
  standalone: true,
  imports: [
    CategoryPlainNamePipe,
    IonButton, IonIcon, IonLabel
  ],
  template: `
  <ion-button [expand]="expand()" [fill]="fill()" [size]="size()" [color]="color() | categoryPlainName:colorsIonic" [disabled]="disabled()">
    <ion-icon [name]="iconName()" [size]="size()" [slot]="slot()" [style.color]="iconColor" />
      @if (label() && label().length > 0) {
        <ion-label>{{ label() }}</ion-label>
      }
  </ion-button>
  `
})
export class BkButtonComponent {
  public label = input('');
  public expand = input<'block'|'full'>('full');
  public fill = input<'clear'|'outline'|'solid'>('solid'); 
  public size = input<'small'|'default'|'large'>('default');
  public color = input<ColorIonic>(ColorIonic.Secondary);
  public disabled = input<boolean>(false);
  public iconName = input<string>('help-outline');
  public slot = input<'start'|'icon-only'|'end'>('start');

  protected iconColor = 'white';
  protected colorsIonic = ColorsIonic;

  constructor() {
    addIcons({checkmarkCircleOutline, helpOutline});
  }
}
