import { Component, input } from '@angular/core';
import { ColorIonic, ColorsIonic } from '@bk/categories';
import { CategoryPlainNamePipe } from '@bk/pipes';
import { IonGrid, IonRow, IonSpinner } from '@ionic/angular/standalone';

export type BkSpinnerName = 'dots' | 'bubbles' | 'circles' | 'crescent' | 'circular' | 'lines' | 'lines-small' | 'lines-sharp' | 'lines-small-sharp' | 'lines-small';
@Component({
  selector: 'bk-spinner',
  standalone: true,
  imports: [
    CategoryPlainNamePipe,
    IonGrid, IonRow, IonSpinner
  ],
  template: `
  <ion-grid style="height: 100%">
    <ion-row justify-content-center align-items-center>
      <ion-spinner [name]="name()" [color]="color() | categoryPlainName:colorsIonic" />
    </ion-row>
  </ion-grid>
  `,
  styles: [`
    ion-grid { height: 100%; flex-direction: column; }
    ion-row { height: 100%; }
    ion-spinner { transform: scale(3); display: block; margin: auto; }
  `]
})
export class BkSpinnerComponent {
  public name = input<BkSpinnerName>('bubbles');
  public color = input<ColorIonic>(ColorIonic.Primary);

  protected colorsIonic = ColorsIonic;
}
