import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SubjectService } from './subject.service';
import { SvgIconPipe } from '@bk/pipes';

@Component({
    selector: 'bk-subject-iterator',
    standalone: true,
    imports: [
      SvgIconPipe,
      CommonModule, IonicModule
    ],
    template: `
    <ion-buttons>
      <ion-button (click)="prev()">
        <ion-icon slot="icon-only" src="{{'arrow-back-circle-outline' | svgIcon }}"></ion-icon>
      </ion-button>
      <ion-button (click)="next()">
        <ion-icon slot="icon-only" src="{{'arrow-forward-circle-outline' | svgIcon }}"></ion-icon>
      </ion-button>
    </ion-buttons>  
  `
  })
  export class BkSubjectIteratorComponent {
    public subjectService = inject(SubjectService);

    public subjectSelected = output<string>();

    public prev(): void {
        this.subjectSelected.emit(this.subjectService.previousKey());
      }
    
      public next(): void {
        this.subjectSelected.emit(this.subjectService.nextKey());
      }
  }