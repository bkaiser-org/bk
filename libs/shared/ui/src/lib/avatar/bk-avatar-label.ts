import { Component, input } from '@angular/core';
import { IonAvatar, IonImg, IonItem, IonLabel } from '@ionic/angular/standalone';
import { AvatarPipe } from './avatar.pipe';
import { AsyncPipe } from '@angular/common';
import { ColorIonic, ColorsIonic } from '@bk/categories';
import { CategoryPlainNamePipe } from '@bk/pipes';

@Component({
  selector: 'bk-avatar-label',
  standalone: true,
  imports: [
    AvatarPipe, AsyncPipe, CategoryPlainNamePipe,
    IonItem, IonAvatar, IonImg, IonLabel
  ],
  template: `
  <ion-item lines="none" [color]="color() | categoryPlainName:colorsIonic">
    <ion-avatar slot="start">
      <ion-img [src]="key() | avatar | async" [alt]="alt()" />
    </ion-avatar>
    <ion-label>{{label()}}</ion-label>      
  </ion-item>
  `,
})
export class BkAvatarLabelComponent {
  public key = input.required<string>();    // modelType[.relationshipType].mkey, e.g. 15.1.1123123asdf
  public label = input('');
  public color = input<ColorIonic>(ColorIonic.White);
  public alt = input('Avatar Logo');

  protected colorsIonic = ColorsIonic;
}
