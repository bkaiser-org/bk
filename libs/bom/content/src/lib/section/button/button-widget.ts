import { NgStyle } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonAction, ColorIonic, ColorsIonic, ImageAction } from '@bk/categories';
import { newImage, SectionModel } from '@bk/models';
import { CategoryPlainNamePipe, FileTypeIconPipe, SvgIconPipe } from '@bk/pipes';
import { downloadToBrowser, ENV, navigateByUrl } from '@bk/util';
import { IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';
import { newButton, newIcon } from './button-section.util';
import { browseUrl } from '@bk/address';
import { Browser } from '@capacitor/browser';
import { showZoomedImage } from '@bk/ui';

@Component({
  selector: 'bk-button-widget',
  standalone: true,
  imports: [
    CategoryPlainNamePipe, FileTypeIconPipe, SvgIconPipe,
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
        @if(iconName(); as iconName) {
          @if(button().buttonAction === BA.Download) {
            <ion-icon [ngStyle]="iconStyle()" src="{{ iconName | fileTypeIcon}}" slot="{{icon().slot}}" />
          } @else {
            <ion-icon [ngStyle]="iconStyle()" src="{{iconName | svgIcon}}" slot="{{icon().slot}}" />
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
  private modalController = inject(ModalController);
  protected env = inject(ENV);
  private router = inject(Router);

  public section = input<SectionModel>();
  protected button = computed(() => this.section()?.properties.button ?? newButton());
  protected icon = computed(() => this.section()?.properties.icon ?? newIcon());
  protected iconName = computed(() => this.icon().name ?? '');

  protected colorsIonic = ColorsIonic;
  protected BA = ButtonAction;
  protected baseImgixUrl = this.env.app.imgixBaseUrl;

  protected iconStyle = computed(() => {
    return {
      'font-size': (this.icon().size ?? '40') + 'px'
    };
  });

  protected buttonStyle = computed(() => {
    return {
      'width': (this.button().width ?? '60') + 'px',
      'height': (this.button().height ?? '60') + 'px',
      'color': this.button().color ?? ColorIonic.Primary
    };
  });

  protected async action(): Promise<void> {
    const _url = this.section()?.url;
    const _image = newImage('Image Zoom', _url);
    if (_url) {
      switch (this.button().buttonAction) {
        case ButtonAction.Download:
          await downloadToBrowser(this.baseImgixUrl + _url);
          break;
        case ButtonAction.Navigate:
          await navigateByUrl(this.router, _url);
          break;
        case ButtonAction.Browse:
          await Browser.open({ url: _url });
          break;
        case ButtonAction.Zoom:
          _image.imageAction = ImageAction.Zoom;
          _image.width = 160;
          _image.height = 90;
          await showZoomedImage(this.modalController, '@content.type.article.zoomedImage', _image, 'full-modal'); 
          break;
        case ButtonAction.None:
          break;
      }
    }
  }
}