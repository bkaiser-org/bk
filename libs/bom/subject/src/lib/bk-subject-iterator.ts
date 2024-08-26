import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SubjectService } from './subject.service';
import { addIcons } from "ionicons";
import { arrowBackCircleOutline, arrowForwardCircleOutline } from "ionicons/icons";

@Component({
    selector: 'bk-subject-iterator',
    standalone: true,
    imports: [CommonModule, IonicModule],
    template: `
    <ion-buttons>
      <ion-button (click)="prev()">
        <ion-icon slot="icon-only" name="arrow-back-circle-outline"></ion-icon>
      </ion-button>
      <ion-button (click)="next()">
        <ion-icon slot="icon-only" name="arrow-forward-circle-outline"></ion-icon>
      </ion-button>
    </ion-buttons>  
  `
  })
  export class BkSubjectIteratorComponent {
    public subjectService = inject(SubjectService);

    public subjectSelected = output<string>();

    constructor() {
      addIcons({arrowBackCircleOutline, arrowForwardCircleOutline});
    }

    public prev(): void {
        this.subjectSelected.emit(this.subjectService.previousKey());
      }
    
      public next(): void {
        this.subjectSelected.emit(this.subjectService.nextKey());
      }
  }