import { AsyncPipe } from "@angular/common";
import { Component } from "@angular/core";
import { SvgIconPipe, TranslatePipe } from "@bk/pipes";
import { IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonLabel, IonMenuButton, IonRow, IonTitle, IonToolbar } from "@ionic/angular/standalone";

enum Tenu {
  Cap,
  Tshirt,
  Shirt,
  Shorts,
  Tights,
  Thermotights,
  Gilet,
  Softshell,
  Poloshirt
}

@Component({
  selector: 'bk-tenu',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe, SvgIconPipe,
    IonHeader, IonToolbar, IonButtons, IonTitle, IonMenuButton, IonBadge, IonButton, IonIcon,
    IonContent, IonGrid, IonRow, IonCol, IonLabel,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent
  ],
  template: `
  <ion-header>
  <ion-toolbar color="secondary">
      <ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons>
      <ion-title>{{ '@cms.tenu.title' | translate | async }}</ion-title>
      <ion-buttons slot="end">
        <ion-badge>2</ion-badge>
        <ion-button color="light" (click)="showCart()">
          <ion-icon slot="icon-only" src="{{'cart-outline' | svgIcon }}" />
        </ion-button>
      </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content #content>
  <ion-grid ion-no-padding>
    <ion-row>
      <ion-col>
        <ion-card (click)="add(TENU.Cap)">
          <ion-card-header>
            <ion-card-title>Cap</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-grid>
              <ion-row>
                <div  class="center"><img alt="cap" src="assets/tenu/cap_240x300.png" /></div></ion-row>
              <ion-row><ion-label>Farbe: blau</ion-label></ion-row>
              <ion-row><ion-label>Typ: Unisex</ion-label></ion-row>
              <ion-row><ion-label>Grössen: Einheitsgrösse</ion-label></ion-row>
              <ion-row><ion-label>CHF 29.00</ion-label></ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
      </ion-col>
      <ion-col>
        <ion-card (click)="add(TENU.Tshirt)">
          <ion-card-header>
            <ion-card-title>T-Shirt</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-grid>
              <ion-row><div  class="center"><img alt="tshirt" src="assets/tenu/tshirt_240x300.png" /></div></ion-row>
              <ion-row><ion-label>kurzarm Meril</ion-label></ion-row>
              <ion-row><ion-label>Typ: Damen, Herren</ion-label></ion-row>
              <ion-row><ion-label>Grössen: S,M,L,XL,XXL</ion-label></ion-row>
              <ion-row><ion-label>CHF 59.00</ion-label></ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
      </ion-col>
      <ion-col>
        <ion-card (click)="add(TENU.Shirt)">
          <ion-card-header>
            <ion-card-title>Shirt</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-grid>
              <ion-row><div  class="center"><img alt="shirt" src="assets/tenu/shirt_240x300.png" /></div></ion-row>
              <ion-row><ion-label>langarm Meril</ion-label></ion-row>
              <ion-row><ion-label>Typ: Damen, Herren</ion-label></ion-row>
              <ion-row><ion-label>Grössen: S,M,L,XL,XXL</ion-label></ion-row>
              <ion-row><ion-label>CHF 64.00</ion-label></ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
      </ion-col>
      <ion-col>
        <ion-card (click)="add(TENU.Shorts)">
          <ion-card-header>
            <ion-card-title>Shorts Supplex</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-grid>
              <ion-row><div  class="center"><img alt="shorts" src="assets/tenu/shorts_240x298.png" /></div></ion-row>
              <ion-row><ion-label>Farbe: schwarz</ion-label></ion-row>
              <ion-row><ion-label>Typ: Unisex</ion-label></ion-row>
              <ion-row><ion-label>Grössen: S,M,L,XL,XXL</ion-label></ion-row>
              <ion-row><ion-label>CHF 49.00</ion-label></ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
      </ion-col>
      <ion-col>
        <ion-card (click)="add(TENU.Tights)">
          <ion-card-header>
            <ion-card-title>Tights Supplex</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-grid>
              <ion-row><div  class="center"><img alt="tights" src="assets/tenu/tights_240x300.png" /></div></ion-row>
              <ion-row><ion-label>Farbe: schwarz</ion-label></ion-row>
              <ion-row><ion-label>Typ: Unisex</ion-label></ion-row>
              <ion-row><ion-label>Grössen: S,M,L,XL,XXL</ion-label></ion-row>
              <ion-row><ion-label>CHF 64.00</ion-label></ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
      </ion-col>
      <ion-col>
        <ion-card (click)="add(TENU.Thermotights)">
          <ion-card-header>
            <ion-card-title>Tights Thermolite</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-grid>
              <ion-row><div  class="center"><img alt="thermotights" src="assets/tenu/tights_240x300.png" /></div></ion-row>
              <ion-row><ion-label>für die kalten Tage</ion-label></ion-row>
              <ion-row><ion-label>Typ: Unisex</ion-label></ion-row>
              <ion-row><ion-label>Grössen: S,M,L,XL,XXL</ion-label></ion-row>
              <ion-row><ion-label>CHF 74.00</ion-label></ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
      </ion-col>
      <ion-col>
        <ion-card (click)="add(TENU.Gilet)">
          <ion-card-header>
            <ion-card-title>Ruder-Gilet</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-grid>
              <ion-row><div  class="center"><img alt="gilet" src="assets/tenu/gilet_240x300.png" /></div></ion-row>
              <ion-row><ion-label>Farbe: weiss/grün/blau</ion-label></ion-row>
              <ion-row><ion-label>Typ: Damen, Herren</ion-label></ion-row>
              <ion-row><ion-label>Grössen: S,M,L,XL,XXL</ion-label></ion-row>
              <ion-row><ion-label>CHF 99.00</ion-label></ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
      </ion-col>
      <ion-col>
        <ion-card (click)="add(TENU.Softshell)">
          <ion-card-header>
            <ion-card-title>Softshell-Jacke</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-grid>
              <ion-row><div  class="center"><img alt="softshell" src="assets/tenu/softshell_240x300.png" /></div></ion-row>
              <ion-row><ion-label>Farbe: blau</ion-label></ion-row>
              <ion-row><ion-label>Typ: Damen, Herren</ion-label></ion-row>
              <ion-row><ion-label>Grössen: S,M,L,XL,XXL</ion-label></ion-row>
              <ion-row><ion-label>CHF 129.00</ion-label></ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
      </ion-col>
      <ion-col>
        <ion-card (click)="add(TENU.Poloshirt)">
          <ion-card-header>
            <ion-card-title>Polo-Shirt</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-grid>
              <ion-row><div  class="center"><img alt="polo-shirt" src="assets/tenu/poloshirt_240x300.png" /></div></ion-row>
              <ion-row><ion-label>Farben: grün, blau, weiss</ion-label></ion-row>
              <ion-row><ion-label>Typ: Damen, Herren</ion-label></ion-row>
              <ion-row><ion-label>Grössen: S,M,L,XL,XXL</ion-label></ion-row>
              <ion-row><ion-label>CHF 44.00</ion-label></ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
      </ion-col>
    </ion-row>
  </ion-grid>
</ion-content>



  `,
  styles: [`
  ion-col {
  background-color: #135d54;
  border: solid 1px #fff;
  color: #fff;
  text-align: center;
}

ion-card{
  display: flex;
  flex-direction: column;
  width: 100% !important;
  min-width: 280px;
  margin: 0 !important;
}

.center {
  display: block;
  margin: auto;
  width: 50%;
 }
  `]
})
export class TenuComponent {
  public TENU = Tenu;

  public add(tenu: Tenu): void {
    console.log('adding ' + tenu);
  }

  public showCart(): void {
    console.log('showing Cart...');
  }
}