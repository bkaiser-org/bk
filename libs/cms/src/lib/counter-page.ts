import { Component } from '@angular/core';
import { BkCounterComponent, BkHeaderComponent } from '@bk/ui';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'bk-counter-page',
  standalone: true,
  imports: [
    BkHeaderComponent, BkCounterComponent,
    IonContent, 
  ],
  template: `
    <bk-header title="Counter" />
    <ion-content #content>
      <bk-counter />
    </ion-content>
  `,
})
export class CounterPageComponent {  
}



