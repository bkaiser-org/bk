import { Component, input } from '@angular/core';
import { IonButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { ColorIonic, ColorsIonic } from '@bk/categories';
import { CategoryPlainNamePipe } from '@bk/pipes';

@Component({
  selector: 'bk-sort-button',
  standalone: true,
  imports: [
    CategoryPlainNamePipe,
    IonButton, IonIcon, IonLabel
  ],
  template: `
  <ion-button [fill]="fill()">
    <ion-icon [color]="color() | categoryPlainName:colorsIonic" [slot]="slot()" [name]="iconName()" />
    <ion-label [color]="color()"><strong>{{label()}}</strong></ion-label>
  </ion-button>
  `
})
export class BkSortButtonComponent {
  public slot = input<'start' | 'end' | 'icon-only'>('end');
  public fill = input<'clear' | 'outline' | 'solid'>('clear');  
  public color = input<ColorIonic>(ColorIonic.Light);
  public iconName = input<string>();
  public label = input<string>();

  protected colorsIonic = ColorsIonic;
}
