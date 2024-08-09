import { Component, input } from '@angular/core';
import { IonItem, IonLabel } from '@ionic/angular/standalone';
import { ColorIonic, ColorsIonic } from '@bk/categories';
import { CategoryPlainNamePipe } from '@bk/pipes';

@Component({
  selector: 'bk-label',
  standalone: true,
  imports: [
    CategoryPlainNamePipe,
    IonItem, IonLabel
  ],
  template: `
    <ion-item [lines]="lines()" [slot]="slot()" [color]="color() | categoryPlainName:colorsIonic">
      <ion-label>{{ label() }}</ion-label>
    </ion-item>
  `
})
export class BkLabelComponent {
  public lines = input<'none' | 'full' | 'inset'>('inset');
  public label = input<string>();
  public color = input<ColorIonic>(ColorIonic.Primary);
  public slot = input<'start' | 'end' | 'icon-only'>('start');

  protected colorsIonic = ColorsIonic;
}
