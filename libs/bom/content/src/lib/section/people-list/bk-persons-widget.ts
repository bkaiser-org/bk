import { Component, computed, inject, input } from '@angular/core';
import { Person, SectionModel } from '@bk/models';
import { IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { BkAvatarLabelComponent } from '@bk/ui';
import { NameDisplay, die, getFullPersonName, navigateByUrl } from '@bk/util';
import { AsyncPipe } from '@angular/common';
import { FullNamePipe, TranslatePipe } from '@bk/pipes';
import { Router } from '@angular/router';
import { ColorIonic } from '@bk/categories';

@Component({
  selector: 'bk-persons-widget',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, FullNamePipe,
    IonGrid,IonRow, IonCol,
    BkAvatarLabelComponent
  ],
  template: `
    @if(section(); as section) {
      <ion-grid>
        <ion-row>
          @if(personList.length === 0) {
            <ion-col>{{ '@content.section.error.noPeople' | translate | async }}</ion-col>
          } @else {
            @for(person of personList(); track person.bkey) {
              @if(cols() === 0) {
                <bk-avatar-label 
                  key="{{'0.' + person.bkey}}" 
                  [label]="getPersonLabel(person)" 
                  [color]="color()"
                  alt="{{altText()}}"
                />
              } @else {
                <ion-col size="12" [sizeMd]="12/cols()" (click)="showPerson(person)">
                <bk-avatar-label 
                  key="{{'0.' + person.bkey}}" 
                  [label]="getPersonLabel(person)" 
                  [color]="color()"
                  alt="{{altText()}}"
                />
              </ion-col>
              }
            }
          }
        </ion-row>
      </ion-grid>
    }
  `
})
export class PersonsWidgetComponent {
  private readonly router = inject(Router);
  public section = input<SectionModel>();
  protected personList = computed(() => this.section()?.properties.personList ?? []);

  protected cols = computed(() => {
    const _cols = this.section()?.properties.avatar?.cols ?? 2;
    if (_cols < 0 || _cols > 4) die('PersonsWidget.cols(): cols must be between 0 and 4');
    return _cols;
  });

  protected showName = computed(() => {
    return this.section()?.properties.avatar?.showName ?? true;
  });

  protected showLabel = computed(() => {
    return this.section()?.properties.avatar?.showLabel ?? true;
  });

  protected nameDisplay = computed(() => {
    return this.section()?.properties.avatar?.nameDisplay ?? NameDisplay.FirstLast;
  });

  protected color = computed(() => {
    return this.section()?.color ?? ColorIonic.Light;
  });

  protected altText = computed(() => {
    return this.section()?.properties.avatar?.altText ?? 'avatar';
  });

  protected getPersonLabel(person: Person): string {
    if (!this.showName()) return '';
    const _name = getFullPersonName(person.firstName, person.lastName, '', this.nameDisplay());
    return (this.showLabel() && person.label.length > 0) ? `${_name} (${person.label})` : _name;
  }

  // tbd: add a group and show all persons of this group
  public showPerson(person: Person): void {
    navigateByUrl(this.router, `/person/${person.bkey}`);
  }
}
