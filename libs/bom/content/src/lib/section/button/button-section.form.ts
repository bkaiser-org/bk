import { Component, computed, model, output } from '@angular/core';
import { Button, Icon, SectionFormModel, SectionProperties } from '@bk/models';
import { BkCatInputComponent, BkLabelSelectModalComponent, BkNumberInputComponent, BkStringSelectComponent, BkTextInputComponent, BkUrlComponent, lowercaseWordMask, sizeMask } from '@bk/ui';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonItem, IonLabel, IonNote, IonRow, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { BkEditorComponent } from '../article/bk-editor';
import { ButtonAction, ColorsIonic, FileTypeIcon, ViewPosition, ViewPositions } from '@bk/categories';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';
import { ButtonFormComponent } from "./button.form";
import { newButton, newIcon } from './button-section.util';
import { IconFormComponent } from './icon.form';
import { ButtonActionFormComponent } from "./button-action.form";

@Component({
  selector: 'bk-button-section-form',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    IonGrid, IonRow, IonCol, IonLabel, IonSelect, IonSelectOption, IonNote, IonItem,
    IonCard, IonCardHeader, IonCardContent, IonCardTitle,
    BkUrlComponent, BkEditorComponent, BkCatInputComponent, BkLabelSelectModalComponent,
    BkTextInputComponent, BkNumberInputComponent, BkStringSelectComponent,
    ButtonFormComponent, IconFormComponent,
    ButtonActionFormComponent, ButtonActionFormComponent
],
  template: `
    @if(vm(); as vm) {
      <bk-button-form [button]="button()" (changedButton)="onButtonChanged($event)" />
      <bk-button-action-form [vm]="vm" (changedAction)="changedAction.emit($event)" (changedUrl)="changedUrl.emit($event)" />
      <bk-icon-form [icon]="icon()" (changedIcon)="onIconChanged($event)" />
      <ion-row>
        <ion-col size="12">
        <ion-card>
            <ion-card-header>
              <ion-card-title>Begleittext</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-note>
                Hier kannst du einen optionalen Begleittext eingeben, der mit dem Button zusammen dargestellt wird.
                Beispielsweise kann bei einem Download-Button beschrieben werden, was heruntergeladen wird (Dateiname, Grösse etc.).
                Mit der Einstellung 'Position des Buttons' bestimmst du, ob der Button links/rechts oder oben/unten vom Text angezeigt wird.
              </ion-note>
              <bk-cat-input name="buttonPosition" [value]="vm.imagePosition!" [categories]="viewPositions" (changed)="changedPosition.emit($event)" />
              <bk-editor [content]="vm.content ?? '<p></p>'" [readOnly]="false" (contentChange)="changedContent.emit($event)" />
              </ion-card-content>
          </ion-card>
         </ion-col>
      </ion-row>
    }
  `
})
export class ButtonSectionFormComponent {
  public vm = model.required<SectionFormModel>();
  public button = computed(() => this.vm().properties?.button ?? newButton());
  public icon = computed(() => this.vm().properties?.icon ?? newIcon());

  public changedProperties = output<SectionProperties>();
  public changedContent = output<string>();
  public changedPosition = output<ViewPosition>();
  public changedAction = output<ButtonAction>();
  public changedUrl = output<string>();

  protected wordMask = lowercaseWordMask;
  protected sizeMask = sizeMask;
  protected isCallAction = true;
  protected colorsIonic = ColorsIonic;
  protected viewPositions = ViewPositions;
  protected extensionList = Object.values(FileTypeIcon);

  protected onButtonChanged(button: Button): void {
    const _sectionProperties = {
      ...this.vm().properties,
      button: button
    };
    this.changedProperties.emit(_sectionProperties);
  }

  protected onIconChanged(icon: Icon): void {
    const _sectionProperties = {
      ...this.vm().properties,
      icon: icon
    };
    this.changedProperties.emit(_sectionProperties);
  }
}
