import { NgStyle } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ColorIonic, ColorsIonic } from '@bk/categories';
import { SectionModel } from '@bk/models';
import { CategoryPlainNamePipe, FileTypeIconPipe } from '@bk/pipes';
import { downloadToBrowser, navigateByUrl } from '@bk/util';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { newButton, newIcon } from '../section.util';

@Component({
  selector: 'bk-button-widget',
  standalone: true,
  imports: [
    CategoryPlainNamePipe, FileTypeIconPipe,
    NgStyle,
    IonButton, IonIcon
  ],
  styles: [`
    .container { margin: 0 auto !important; text-align: center; vertical-align: middle;}
  `],
  template: `
    <div class="container">
      <ion-button (click)="action()"
        [ngStyle]="buttonStyle()"
        shape="{{button().shape}}"
        fill="{{button().fill}}"
        color="{{button().color | categoryPlainName:colorsIonic}}">
        @if(iconName() && iconName().length > 0; as iconName) {
          @if(isCallAction()) {                                 <!-- ion-icon -->
            <ion-icon [ngStyle]="iconStyle()" name="{{iconName}}" slot="{{icon().slot}}" />
          }
          @else {                                       <!-- svg -->       
            <ion-icon [ngStyle]="iconStyle()" src="{{ (icon().name ?? '') | fileTypeIcon}}" slot="{{icon().slot}}" />
          }
        }
        @if(button().label) {
          {{button().label}}
        }
      </ion-button>
    </div>
  `
})
export class ButtonWidgetComponent {
  private router = inject(Router);
  public section = input<SectionModel>();
  protected button = computed(() => this.section()?.properties.button ?? newButton());
  protected icon = computed(() => this.section()?.properties.icon ?? newIcon());
  protected iconName = computed(() => this.icon().name ?? '');

  protected colorsIonic = ColorsIonic;

  // if the icon name contains a dash, then it is an ion-icon and therefore a call action
  protected isCallAction = computed(() => {
    return this.iconName().indexOf('-') > 0;
  });

  protected iconStyle = computed(() => {
    return {
      'font-size': this.section()?.properties.icon?.size ?? '40px'
    };
  });

  protected buttonStyle = computed(() => {
    return {
      'width': this.button().width ?? '60px',
      'height': this.button().height ?? '60px',
      'color': this.button().color ?? ColorIonic.Primary
    };
  });

  protected action(): void {
    const _url = this.section()?.url;
    if (_url) {
      if (this.isCallAction()) {
        navigateByUrl(this.router, _url);
      } else {
        downloadToBrowser(_url);
      }
    }
  }
}