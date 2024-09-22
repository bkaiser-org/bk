import { Component, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { AppNavigationService, isInSplitPane, navigateByUrl } from '@bk/util';
import { selectMenuItem } from './menu.util';
import { IonAccordion, IonAccordionGroup, IonIcon, IonItem, IonItemDivider, IonLabel, IonList, MenuController } from '@ionic/angular/standalone';
import { AuthorizationService } from '@bk/base';
import { SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MenuAction } from '@bk/categories';
import { MenuItemModel } from '@bk/models';
import { BkSpinnerComponent } from '@bk/ui';
import { MenuItemService } from './menu-item.service';
import { Observable } from 'rxjs';
import { AuthService } from '@bk/auth';

@Component({
  selector: 'bk-menu',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, JsonPipe, SvgIconPipe,
    BkSpinnerComponent, BkMenuComponent,
    IonList, IonItem, IonIcon, IonLabel, IonAccordionGroup, IonAccordion, IonItemDivider
  ],
  template: `
    @if(menuItem$ | async; as menuItem) {
       @if (authorizationService.hasRole(menuItem.roleNeeded)) {
        @switch(menuItem.category) {
          @case(MA.Navigate) {
            <ion-item button (click)="select(menuItem)">
              <ion-icon slot="start" src="{{menuItem.icon | svgIcon }}" color="primary" />
              <ion-label>{{ menuItem.label | translate | async }}</ion-label>
            </ion-item>
          }
          @case(MA.Browse) {
            <ion-item button (click)="select(menuItem)">
              <ion-icon slot="start" src="{{menuItem.icon | svgIcon }}" color="primary" />
              <ion-label>{{ menuItem.label | translate | async }}</ion-label>
            </ion-item>
          }
          @case(MA.SubMenu) {
            <ion-accordion-group>
              <ion-accordion [value]="menuItem.name" toggle-icon-slot="start" >
                <ion-item slot="header" color="primary">
                  <ion-label>{{menuItem.label | translate | async}}</ion-label>
                </ion-item>
                <div slot="content">
                  @for(menuItemName of menuItem.menuItems; track menuItemName) {
                    <bk-menu [menuName]="menuItemName" />
                  }
                </div>
              </ion-accordion>
            </ion-accordion-group>
          }
          @case(MA.Divider) {
            <ion-item-divider color="light">
              <ion-label>{{ menuItem.label | translate | async }}</ion-label>
            </ion-item-divider>
          }
          @case(MA.MainMenu) {
            <ion-list>
              @for(menuItemName of menuItem.menuItems; track menuItemName) {
                <bk-menu [menuName]="menuItemName" />
              }
            </ion-list>
          }
        }
      }
    } 
  `
})
export class BkMenuComponent {
  public authService = inject(AuthService);
  public authorizationService = inject(AuthorizationService);
  public appNavigationService = inject(AppNavigationService);
  private menuItemService = inject(MenuItemService);
  private router = inject(Router);
  private menuController = inject(MenuController);

  public menuName = input.required<string>();
  public menuItem$!: Observable<MenuItemModel>;

  public MA = MenuAction;

  constructor() {
    effect(async () => {
      this.menuItem$ = this.menuItemService.readMenuItem(this.menuName());
    });
  }

  public async select(menuItem: MenuItemModel): Promise<void> {
    this.appNavigationService.resetLinkHistory(menuItem.url);
    if (menuItem.url === '/auth/logout') {
      await this.authService.logout();
      await navigateByUrl(this.router, '/auth/login', menuItem.data);
    } else {
      await selectMenuItem(this.router, menuItem);
    }
    if (!isInSplitPane()) this.menuController.close('main');
  }
}
