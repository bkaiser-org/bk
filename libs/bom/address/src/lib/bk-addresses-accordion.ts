import { Component, OnInit, inject, input } from '@angular/core';
import { Observable } from 'rxjs';
import { AddressUsageNamePipe, ChannelIconPipe, FavoriteColorPipe, FavoriteIconPipe, FormatAddressPipe, SvgIconPipe, TranslatePipe } from '@bk/pipes';
import { AddressModel, isAddress } from '@bk/models';
import { AddressService } from './address.service';
import { IonAccordion, IonButton, IonCol, IonGrid, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonRow, ModalController } from '@ionic/angular/standalone';
import { AsyncPipe } from '@angular/common';
import { BkSpinnerComponent } from '@bk/ui';
import { AddressEditModalComponent } from './address-edit-modal';
import { createPostalAddress } from './address.util';
import { AddressUsage, ModelType } from '@bk/categories';

@Component({
  selector: 'bk-addresses-accordion',
  standalone: true,
  imports: [ 
    TranslatePipe, AsyncPipe,
    BkSpinnerComponent,
    FavoriteColorPipe, FavoriteIconPipe, ChannelIconPipe, AddressUsageNamePipe, FormatAddressPipe, SvgIconPipe,
    IonAccordion, IonItem, IonLabel, IonButton, IonIcon, IonGrid, IonRow, IonCol, 
    IonItemSliding, IonItemOptions, IonItemOption, IonList
  ],
  styles: [`
    ion-icon {
      padding-right: 5px;
    }
  `],
  template: `
  <ion-accordion toggle-icon-slot="start" value="addresses">
    <ion-item slot="header" [color]="color()">
        <ion-label>{{ label() | translate | async }}</ion-label>
        @if(readOnly() === false) {
          <ion-button fill="outline" slot="end" (click)="editAddress()">
            <ion-icon color="secondary" slot="icon-only" src="{{ 'add-circle-outline' | svgIcon }}" />
          </ion-button>
        }
    </ion-item>
    <div slot="content">
      @if((addresses$ | async); as addresses) {
        <ion-list lines="none">
          @if(addresses.length === 0) {
            <ion-item>
              <ion-label>{{ '@general.noData.addresses' | translate | async }}</ion-label>
            </ion-item>
          } @else {
            @for(address of addresses; track address.bkey) {
              <ion-item-sliding #slidingItem>
                <ion-item (click)="addressService.useAddress(address)">
                  <ion-label>
                    <ion-icon src="{{ address.isFavorite | favoriteIcon }}" color="{{ address.isFavorite | favoriteColor }}" />
                    @if(address.isCc) {
                      <ion-icon src="{{ 'logo-closed-captioning' | svgIcon }}" />
                    }
                    @if(address.isValidated) {
                      <ion-icon src="{{ 'shield-checkmark-outline' | svgIcon }}" />
                    }
                    <ion-icon [src]="address.category | channelIcon" />
                    <span class="ion-hide-md-down"> {{ address.addressUsage | addressUsageName:address.addressUsageLabel }}</span>
                  </ion-label>
                  <ion-label>
                    {{ address.name | formatAddress:address.addressValue2:address.zipCode:address.city:address.category }}
                  </ion-label>
                </ion-item>
                @if(readOnly() === false) {
                  <ion-item-options side="end">
                    <ion-item-option color="danger" (click)="deleteAddress(slidingItem, address)"><ion-icon slot="icon-only" src="{{'trash-outline' | svgIcon }}" /></ion-item-option>
                    <ion-item-option color="light" (click)="copyAddress(slidingItem, address)"><ion-icon slot="icon-only" src="{{'copy-outline' | svgIcon }}" /></ion-item-option>
                    <ion-item-option color="primary" (click)="editAddress(slidingItem, address)"><ion-icon slot="icon-only" src="{{'create-outline' | svgIcon }}" /></ion-item-option>
                    <ion-item-option color="light" (click)="uploadEzs(slidingItem, address)"><ion-icon slot="icon-only" src="{{'qr-code-outline' | svgIcon }}" /></ion-item-option>
                  </ion-item-options>
                }
              </ion-item-sliding>
            }
          }
        </ion-list>
      } @else {
        <bk-spinner />
      }
    </div>
  </ion-accordion>
  `,
})
export class BkAddressesAccordionComponent implements OnInit {
  protected modalController = inject(ModalController);
  public addressService = inject(AddressService);

  public parentKey = input.required<string>(); // key of the subject that the address belongs to
  public parentType = input.required<ModelType>(); // type of the subject that the address belongs to

  // we need to solve the access with an input parameter (instead of using the authorizationService),
  // in order to support the profile use case (where the current user is allowed to edit addresses even if she does not have memberAdmin role)
  public readOnly = input(true); // if true, the addresses are read-only
  public color = input('primary'); // color of the accordion
  public label = input('@subject.address.plural'); // label of the accordion

  public addresses$: Observable<AddressModel[]> | undefined;
  protected addressKey: string | undefined;

  ngOnInit() {
    this.addresses$ = this.addressService.listAddresses(this.parentKey());
  }

  public async toggleFavoriteAddress(address: AddressModel): Promise<void> {
    if (this.readOnly() === false) {
      await this.addressService.toggleFavoriteAddress(address);
    }
  }

  public async deleteAddress(slidingItem: IonItemSliding, address: AddressModel): Promise<void> {
    slidingItem.close();
    await this.addressService.deleteAddress(address);
  }

  public async copyAddress(slidingItem: IonItemSliding, address: AddressModel): Promise<void> {
    slidingItem.close();
    await this.addressService.copyAddress(address);
  }

  public async editAddress(slidingItem?: IonItemSliding, address?: AddressModel): Promise<void> {
    if (slidingItem) slidingItem.close();
    let _address = address;
    if (!_address) {
      _address = createPostalAddress(AddressUsage.Home, '', '', '', '', '', true);
      _address.parentKey = this.parentKey();
    }
    const _modal = await this.modalController.create({
      component: AddressEditModalComponent,
      componentProps: {
        address: _address,
        parentType: this.parentType(),
        readOnly: this.readOnly()
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      if (isAddress(data)) {
        await (!address) ? this.addressService.saveNewAddress(data) : this.addressService.updateAddress(data);
      }
    }
  }

  public async uploadEzs(slidingItem?: IonItemSliding, address?: AddressModel): Promise<void> {
    if (slidingItem) slidingItem.close();
    if (address) {
      const _url = await this.addressService.uploadEzs(address.parentKey, this.parentType());
      if (_url) {
        address.url = _url;
        await this.addressService.updateAddress(address);
      }
    }
  }
}
