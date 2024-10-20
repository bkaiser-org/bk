import { Component, computed, input, model, output } from '@angular/core';
import { ButtonAction, ButtonActions } from '@bk/categories';
import { SectionFormModel } from '@bk/models';
import { BkCatInputComponent, BkNumberInputComponent, BkStringSelectComponent, BkTextInputComponent } from '@bk/ui';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonNote, IonRow } from '@ionic/angular/standalone';
import { newButton } from './button-section.util';

@Component({
  selector: 'bk-button-action-form',
  standalone: true,
  imports: [
    IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonNote, IonCardSubtitle,
    BkCatInputComponent, BkTextInputComponent, BkNumberInputComponent, BkStringSelectComponent
  ],
  template: `
    @if(vm(); as vm) {
      <ion-row>
        <ion-col size="12"> 
          <ion-card>
            <ion-card-header>
              <ion-card-title>Action - Konfiguration</ion-card-title>
              <ion-card-subtitle>Definiere was bei einem Klick auf den Button passieren soll.</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <small>
              <div [innerHTML]="description"></div>
              </small>          
              <ion-grid>
                <ion-row>
                  <ion-col size="12" size-md="6">                                <!-- action -->
                    <bk-cat-input name="buttonAction" [value]="action()" [categories]="BAS" (changed)="onActionChanged($event)" />
                  </ion-col>
                  @if(action() !== BA.None) {
                    <ion-col size="12" size-md="6">                            <!-- url --> 
                      <bk-text-input name="url" [value]="vm.url ?? ''" (changed)="changedUrl.emit($event)" [maxLength]=100 />                             
                    </ion-col>
                  }
                </ion-row>
              </ion-grid>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    }
  `
})
export class ButtonActionFormComponent {
  public vm = model.required<SectionFormModel>();
  protected action = computed(() => this.vm().properties?.button?.buttonAction ?? ButtonAction.None);

  protected BAS = ButtonActions;
  protected BA = ButtonAction;
  protected description = `
  <ul>
  <li><strong>Download:</strong> Der Button startet einen Download der mittels URL referenzierten Datei. Die URL muss auf eine Datei im Firebase Storage zeigen.</li>
  <li><strong>Navigieren:</strong> Der Button navigiert zur angegebenen URL. Die URL muss eine interne Route sein (siehe dazu die MenuItem Konfiguration).</li>
  <li><strong>Browse:</strong> Der Button linkt auf eine externe URL (https://domain.com/path).</li>
  <li><strong>Zoom:</strong> Die in der URL referenzierte Datei wird in einem Zoom-Viewer angezeigt (typischerweise ein Bild). Die URL muss auf eine Datei im Firebase Storage zeigen.</li>
  <li><strong>Keine:</strong> Keine Aktion wird ausgeführt. Die URL wird ignoriert. Dies ist die Default-Einstellung.</li>
  </ul>
  `;

  public changedAction = output<ButtonAction>();
  public changedUrl = output<string>();

  protected onActionChanged(value: ButtonAction) {
    const _button = this.vm().properties?.button ?? newButton();
    this.vm.update((_vm) => ({ ..._vm, properties: { ..._vm.properties, button: { ..._button, buttonAction: value } } }));
    this.changedAction.emit(value);
  }
}
