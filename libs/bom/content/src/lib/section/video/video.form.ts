import { Component, model } from '@angular/core';
import { SectionFormModel } from '@bk/models';
import { BkTextInputComponent } from '@bk/ui';
import { IonCol, IonRow } from '@ionic/angular/standalone';

@Component({
  selector: 'bk-video-section-form',
  standalone: true,
  imports: [
    IonRow, IonCol,
    BkTextInputComponent
  ],
  template: `
    @if(vm(); as vm) {
      <ion-row>
        <ion-col size="12">
          <bk-text-input name="youtubeId" [value]="vm.url!" (changed)="updateField($event)" [maxLength]=11 [showError]=true [showHelper]=true />                                        
        </ion-col>
      </ion-row>
    }
  `
})
export class VideoSectionFormComponent {
  public vm = model.required<SectionFormModel>();

  protected updateField(url: string): void {
    this.vm.update((_vm) => ({..._vm, url: url}));
  }
} 