import { Component, input } from '@angular/core';
import { SectionModel } from '@bk/models';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { BkSpinnerComponent } from '@bk/ui';

@Component({
  selector: 'bk-list-section',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, 
    BkSpinnerComponent,
    IonCard, IonCardContent
  ],
  styles: [`
    ion-card-content { padding: 0px; }
    ion-card { padding: 0px; margin: 0px; border: 0px; box-shadow: none !important;}
  `],
  template: `
    @if(section(); as section) {
      <ion-card>
        <ion-card-content>
        </ion-card-content>
      </ion-card>

    } @else {
      <bk-spinner />
    }
  `
})
export class ListSectionComponent {
  public section = input<SectionModel>();

}
