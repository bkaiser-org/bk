import { Component, inject } from '@angular/core';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonMenu,
  IonRouterOutlet,
  IonSplitPane,
  IonTitle,
  IonToolbar,
  Platform,
} from '@ionic/angular/standalone';
import { TranslocoModule } from '@jsverse/transloco';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@bk/pipes';
import { BkMenuComponent } from '@bk/content';
import { AuthInfoComponent, AuthorizationService } from '@bk/base';
import { AuthService } from '@bk/auth';
import { ConfigService } from '@bk/util';
import { ModelType } from '@bk/categories';

@Component({
  standalone: true,
  imports: [
    TranslatePipe,
    AsyncPipe,
    BkMenuComponent,
    AuthInfoComponent,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonHeader,
    IonTitle,
    IonContent,
    IonToolbar,
    IonRouterOutlet,
  ],
  selector: 'bk-root',
  styles: [
    `
      /* ----------------------------------------------
    * Generated by Animista on 2024-8-1 15:19:28
    * Licensed under FreeBSD License.
    * See http://animista.net/license for more info. 
    * w: http://animista.net, t: @cssanimista
    * ---------------------------------------------- */

      /**
    * ----------------------------------------
    * animation kenburns-top
    * ----------------------------------------
    */
      @-webkit-keyframes kenburns-top {
        0% {
          -webkit-transform: scale(1) translateY(0);
          transform: scale(1) translateY(0);
          -webkit-transform-origin: 50% 16%;
          transform-origin: 50% 16%;
        }
        100% {
          -webkit-transform: scale(1.25) translateY(-15px);
          transform: scale(1.25) translateY(-15px);
          -webkit-transform-origin: top;
          transform-origin: top;
        }
      }
      @keyframes kenburns-top {
        0% {
          -webkit-transform: scale(1) translateY(0);
          transform: scale(1) translateY(0);
          -webkit-transform-origin: 50% 16%;
          transform-origin: 50% 16%;
        }
        100% {
          -webkit-transform: scale(1.25) translateY(-15px);
          transform: scale(1.25) translateY(-15px);
          -webkit-transform-origin: top;
          transform-origin: top;
        }
      }

      .logo-container {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #1a5fab;
        height: 100%;
      }
      .kenburns-top {
        -webkit-animation: kenburns-top 1s
          cubic-bezier(0.6, -0.28, 0.735, 0.045) both;
        animation: kenburns-top 1s cubic-bezier(0.6, -0.28, 0.735, 0.045) both;
        margin: 0 auto;
        display: block;
        width: 33%;
      }
    `,
  ],
  template: `
    @defer(on viewport) {
    <!--
        bk app has one single, left menu -> main-menu
        menuitem contents are dependent on e.g. authentication and user role
        register all menus here, derive them from BaseMenu and set a menu id within the class
        use MenuController with this.menu.enable(true, menuId) to switch the menus
      -->
    <ion-app>
      <ion-split-pane contentId="main">
        <ion-menu side="start" menuId="main" contentId="main" type="overlay">
          <ion-header>
            <ion-toolbar color="secondary">
              <ion-title>{{
                '@menu.main.title' | translate | async
              }}</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content>
            <bk-menu menuName="main" />
            @if (authorizationService.currentUser?.showDebugInfo === true) {
            <bk-auth-info />
            }
          </ion-content>
        </ion-menu>
        <ion-router-outlet id="main" />
      </ion-split-pane>
    </ion-app>
    } @placeholder (minimum 1000ms) {
    <div class="logo-container">
      <img class="kenburns-top" src="assets/icon/logo.svg" alt="logo" />
    </div>
    } @loading(after 100ms; minimum 500ms) {
    <span>Bitte warten... die Applikation wird geladen.</span>
    } @error {
    <span
      >Oops ! Die Applikation konnte nicht geladen werden. Bitte nochmals
      probieren.
    </span>
    }
  `,
})
export class AppComponent {
  protected authorizationService = inject(AuthorizationService);
  protected authService = inject(AuthService);
  private platform = inject(Platform);
  private configService = inject(ConfigService);

  public appVersion = this.configService.getConfigString('app_version');
  public MT = ModelType;

  constructor() {
    this.initializeApp();
  }

  private async initializeApp(): Promise<void> {
    await this.platform.ready();
    console.log(
      'app.component.initializeApp(): platforms=' + this.platform.platforms()
    );
  }
}
