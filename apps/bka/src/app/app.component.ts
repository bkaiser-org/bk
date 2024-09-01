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

// register swiper's custom elements globally (should only be done once)
//import { register } from 'swiper/element/bundle';
//register();

@Component({
  standalone: true,
  imports: [
    TranslatePipe,
    AsyncPipe,
    BkMenuComponent,
    AuthInfoComponent,
    TranslocoModule,
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
  template: `
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
            @if (authorizationService.currentUser()?.showDebugInfo === true) {
              <bk-auth-info />
            }
          </ion-content>
        </ion-menu>
        <ion-router-outlet id="main" />
      </ion-split-pane>
    </ion-app>
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
