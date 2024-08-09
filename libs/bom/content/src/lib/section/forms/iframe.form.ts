import { Component, computed, model, output } from '@angular/core';
import { Iframe, SectionFormModel, SectionProperties } from '@bk/models';
import { BkTextInputComponent, BkUrlComponent } from '@bk/ui';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonRow } from '@ionic/angular/standalone';
import { error } from '@bk/util';
import { TranslatePipe } from '@bk/pipes';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bk-iframe-section-form',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    BkTextInputComponent, BkUrlComponent
  ],
  template: `
    @if(vm(); as vm) {
      <ion-row>
        <ion-col size="12">
          <ion-card>
            <ion-card-header>
              <ion-card-title>{{ '@content.section.forms.iframe.title' | translate | async}}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <bk-url [value]="vm.url ?? ''" (changed)="changedUrl.emit($event)" />
              <bk-text-input name="title" [value]="iframe()?.title!" (changed)="onIframePropertyChanged('title', $event)" 
                label="@input.title.label"
                placeholder="@input.title.placeholder"
              />
              <bk-text-input  name="style" [value]="iframe()?.style!" (changed)="onIframePropertyChanged('style', $event)" 
                label="@input.style.label" [maxLength]=200
                placeholder="@input.style.placeholder"
                helperText="@input.style.helper"
              />
            </ion-card-content>
          </ion-card>                                                   
        </ion-col>
      </ion-row>
    }
  `
})
export class BkIframeSectionFormComponent {
  public vm = model.required<SectionFormModel>();
  protected iframe = computed(() => this.vm().properties?.iframe);

  public changedProperties = output<SectionProperties>();
  public changedUrl = output<string>();

  protected onIframePropertyChanged(fieldName: keyof Iframe, value: string | boolean | number) {
    const _config = this.vm().properties?.iframe ?? {
      title: '',
      style: 'width: 100%; min-height:400px; border: none;'
    };
    switch (fieldName) {
      case 'title': _config.title = value as string; break;
      case 'style': _config.style = value as string; break;
      default: error(undefined, `BkPeopleListSectionFormComponent.onIframePropertyChanged: unknown field ${fieldName}`); return;
    }
    const _properties = this.vm().properties;
    if (_properties) {
      _properties.iframe = _config;
    }
    this.changedProperties.emit({
      iframe: _config
    });
  }
}
