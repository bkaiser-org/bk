import { Component, effect, inject, input, output } from '@angular/core';
import { getNonSelectedTags, string2stringArray } from '@bk/util';
import { IonButton, IonButtons, IonChip, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonModal, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { BkTagSelectModalComponent } from '../modals/tag-select.modal';

@Component({
  selector: 'bk-tags',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, SvgIconPipe,
    BkTagSelectModalComponent,
    IonItem, IonLabel, IonIcon, IonChip, IonButton,
    IonModal, IonContent,
    IonHeader, IonToolbar, IonButtons, IonTitle
  ],
  template: `
    <ion-item lines="none">
      @if (readOnly()) {
        <ion-label class="ion-hide-sm-down">Tags</ion-label>
        <div  class="ion-text-wrap">
          @for (tag of selectedTags; track tag) {
            <ion-chip color="primary">
              <ion-label>{{ '@tag.' + tag | translate | async }}</ion-label>
            </ion-chip>
          }
        </div>
      } @else {
        <ion-button fill="clear" (click)="addTag()">
          <ion-icon slot="start" src="{{'pricetag-outline' | svgIcon }}" />
          <ion-label class="ion-hide-sm-down">Tags</ion-label>
        </ion-button>
        <div  class="ion-text-wrap">
          @for (tag of selectedTags; track tag) {
            <ion-chip color="primary">
              <ion-button fill="clear" (click)="removeTag(tag)">
                <ion-icon src="{{'close-circle-outline' | svgIcon }}" slot="start" [style.color]="'primary'" />
                <ion-label>{{ '@tag.' + tag | translate | async }}</ion-label>
              </ion-button>
            </ion-chip>
          }
        </div>
      }
    </ion-item>
  `
})
export class BkTagsComponent {
  protected modalController = inject(ModalController);
  public storedTags = input.required<string>();    // the list of tag names, separated by comma, as read from the database
  public allTags = input.required<string>();       // a comma-separated list of all available tags
  public readOnly = input(false); // if true, the selected tags are shown as ready-only, disabled chips
  protected selectedTags: string[] = [];
  protected nonSelectedTags: string[] = [];
  public changedTags = output<string>(); // event to notify the parent component about changes

  constructor() {
    effect(() => {
      this.selectedTags = string2stringArray(this.storedTags());
      this.nonSelectedTags = getNonSelectedTags(string2stringArray(this.allTags()), this.selectedTags);
    });
  }

  public removeTag(tag: string): void {
    this.selectedTags.splice(this.selectedTags.indexOf(tag), 1);
    this.nonSelectedTags.push(tag);
    this.changedTags.emit(this.selectedTags.join(',')); // converts array back into a comma-separated string
  }

  public async addTag() {
    const _modal = await this.modalController.create({
      component: BkTagSelectModalComponent,
      cssClass: 'tag-modal',
      componentProps: {
        tags: this.nonSelectedTags
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      const _tag = data as string;
      this.selectedTags.push(_tag);
      this.nonSelectedTags.splice(this.nonSelectedTags.indexOf(_tag), 1);
      this.changedTags.emit(this.selectedTags.join(',')); // converts array back into a comma-separated string
    }
  }
}

