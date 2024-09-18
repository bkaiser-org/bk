import { Injectable, inject } from "@angular/core";
import { Observable, map, of } from "rxjs";
import { CollectionNames, bkTranslate, die, error, warn, ENV } from "@bk/util";
import { AddressChannel, AddressUsage, ModelType, getModelSlug } from "@bk/categories";
import { AddressModel, EZS_DIR } from "@bk/models";
import { copyAddress, createPostalAddress, getAddressIndex, getStringifiedPostalAddress, useAddress } from "./address.util";
import { DataService } from "@bk/base";
import { AlertController, ModalController, Platform, ToastController } from "@ionic/angular/standalone";
import { GeocodingService } from "./geocode.service";
import { ImageViewModalComponent, MapViewModalComponent, UploadTaskComponent, readAsFile } from "@bk/ui";
import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";

@Injectable({
    providedIn: 'root'
})
export class AddressService {
  private dataService = inject(DataService);
  private geocodeService = inject(GeocodingService);
  private alertController = inject(AlertController);
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);
  private platform = inject(Platform);
  private env = inject(ENV);

  public modelType = ModelType.Address;
  public groupedItems$ = of([]);

  /***************************  CRUD-operations *************************** */
  /**
   * Create a new address (if there is no existing address with the given key) or read the existing address
   * @param parentKey  the key of the parent model (typically a subject)
   * @param addressKey the key of the address document
   * @returns an Observable of the new or existing address.
   */
  public createOrReadAddress(parentKey: string | undefined, addressKey: string | undefined): Observable<AddressModel | undefined> {
    if (!parentKey || parentKey.length === 0 || addressKey === undefined) { // create a new address
        return of(createPostalAddress(AddressUsage.Home, '', '', '', '', '', true));
    } else { // resolve the existing address
        return this.readAddress(parentKey, addressKey);
    }
}

 /**
   * Return an Observable of an Address by uid from the database.
   * @param parentKey  the key of the parent model (typically a subject)
   * @param addressKey the key of the address document
   */
  public readAddress(parentKey: string, addressKey: string): Observable<AddressModel | undefined> {
    if (addressKey?.length === 0) die('AddressModelUtil.readAddress: uid is mandatory');
    if (parentKey?.length === 0) die('AddressModelUtil.readAddress: parentKey is mandatory');
    return this.dataService.readModel(`${CollectionNames.Subject}/${parentKey}/${CollectionNames.Address}`, addressKey) as Observable<AddressModel>;
  }

  /**
   * Update an existing address.
   * @param address the address with new values
   * @returns the key of the updated address
   */
  public updateAddress(address: AddressModel): Promise<string> {
    if (!address || address.parentKey?.length === 0) {
      warn('AddressService.updateAddress: address with attribute parentKey are mandatory.');
      return Promise.resolve('');
    }
    address.index = getAddressIndex(address);
    return this.dataService.updateModel(`${CollectionNames.Subject}/${address.parentKey}/${CollectionNames.Address}`, address, '@subject.address.operation.update');
  }

  /**
   * Delete an address.
   * We don't delete addresses finally. Instead we deactivate/archive the objects.
   * Admin user sees the deactivated objects (ALLA- or ARCH-list) and can re-activate these objects.
   * Admin user may also finally delete objects directly in the database.
   * @param address the object to delete
   */
  public async deleteAddress(address: AddressModel): Promise<void> {
    if (!address || address.parentKey?.length === 0) {
      warn('AddressService.deleteAddress: address with attribute parentKey are mandatory.');
      return;
    }
    if (this.alertController !== undefined) {
        const _alert = await this.alertController.create({
            header: bkTranslate('@subject.address.operation.delete.label'),
            message: bkTranslate('@subject.address.operation.delete.askConfirmation'),
            buttons: [{
                text: bkTranslate('@general.operation.change.cancel')
            }, {
                text: bkTranslate('@general.operation.change.ok'),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                handler: async _data => {
                    address.isArchived = true;
                    address.index = getAddressIndex(address);
                    await this.dataService.updateModel(`${CollectionNames.Subject}/${address.parentKey}/${CollectionNames.Address}`, address, '@subject.address.operation.delete');
                }
            }]
        });
        await _alert.present();
    } else {
        if (address.isFavorite === true) {
            address.isFavorite = false;
        }
        address.isArchived = true;
        address.index = getAddressIndex(address);
        await this.dataService.updateModel(`${CollectionNames.Subject}/${address.parentKey}/${CollectionNames.Address}`, address, '@subject.address.operation.delete');
    }
  }

  /**
   * Return all addresses of a subject as an Observable array. The data is sorted ascending by the category.
   * @param parentKey the key of the parent object (a subject)
   */
    public listAddresses(parentKey: string | undefined, byChannel?: AddressChannel): Observable<AddressModel[]> {
      if (parentKey === undefined || parentKey.length === 0) return of([]);
      if (byChannel !== undefined) {
        return this.dataService.listModelsBySingleQuery(`${CollectionNames.Subject}/${parentKey}/${CollectionNames.Address}`, 'category', byChannel) as Observable<AddressModel[]>;
      } else {
        return this.dataService.listAllModels(`${CollectionNames.Subject}/${parentKey}/${CollectionNames.Address}`, 'category', 'asc') as Observable<AddressModel[]>;
      }
  }

  /**
   * Toggle the favorite attribute.
   * @param address the object to delete
   */
  public async toggleFavoriteAddress(address: AddressModel | undefined): Promise<void> {
    if (!address || address.parentKey?.length === 0) {
      warn('AddressService.toggleFavoriteAddress: address with attribute parentKey are mandatory.');
      return;
    }
    address.isFavorite = !address.isFavorite; // toggle
    address.index = getAddressIndex(address);
    const _operation = address.isFavorite ? 'enable' : 'disable';
    await this.dataService.updateModel(`${CollectionNames.Subject}/${address.parentKey}/${CollectionNames.Address}`, address, `@subject.address.operation.favorite.${_operation}`);
  }
  
  /***************************  use an address *************************** */
  /**
   * Use an address, e.g. browse to a web address or call a phone number.
   * @param address 
   */
  public async useAddress(address: AddressModel): Promise<void> {
    if (address.category === AddressChannel.Postal) {
      this.showAddress(address);
    } else if (address.category === AddressChannel.BankAccount) {
      this.showQrPaymentSlip(address);
    } else {
      useAddress(address);
    }
  }

  public async showAddress(address: AddressModel): Promise<void> {
    const _addressStr = getStringifiedPostalAddress(address, this.env.i18n.userLanguage);
    if (!_addressStr) return;
    const _coordinates = await this.geocodeService.geocodeAddress(_addressStr);
    if (!_coordinates) return;
    const _modal = await this.modalController.create({
      component: MapViewModalComponent,
      componentProps: {
        title: _addressStr,
        initialPosition: _coordinates
      }
    });
    _modal.present();
    await _modal.onDidDismiss();
    // temporary solution
    //const _url = `https://www.google.com/maps/search/?api=1&query=${_addressStr}`;
    //window.open(_url, '_blank');

    // route: 
    // https://www.google.com/maps/dir/47.2455199,8.710301/47.366659,8.550004/@47.3037508,8.4689009,11z?entry=ttu
  }

  public async showQrPaymentSlip(address: AddressModel): Promise<void> {
    const _modal = await this.modalController.create({
      component: ImageViewModalComponent,
      componentProps: {
        title: "QR Einzahlungsschein",
        image: {
          url: address.url,
          imageLabel: '',
          downloadUrl: '',
          imageOverlay: '',
          altText: 'QR Code of Payment Slip',
          isThumbnail: false,
          isZoomable: false,
          hasPriority: true,
          fill: true,
          sizes: '(max-width: 786px) 50vw, 100vw',
        }}
    });
    _modal.present();
    await _modal.onDidDismiss();
  }

  /**
   * Copy the address to the Clipboard.
   * @param address 
   */
  public async copyAddress(address: AddressModel): Promise<void> {
      await copyAddress(this.toastController, this.env.settingsDefaults.toastLength, address, this.env.i18n.userLanguage);
  }

  /**
   * Create and save a new address under a given parent subject into the database.
   * @param address the address to store in the database
   */
  public async saveNewAddress(address: AddressModel): Promise<void> {
    if (!address || address.parentKey?.length === 0) {
      warn('AddressService.saveNewAddress: address with attribute parentKey are mandatory.');
      return;
    }
    address.index = getAddressIndex(address);
    await this.dataService.createModel(`${CollectionNames.Subject}/${address.parentKey}/${CollectionNames.Address}`, address, '@subject.address.operation.create');
  }

  /***************************  favorite address  *************************** */
  /**
   * Returns either the favorite address of the given channel or null if there is no favorite address for this channel.
   * @param parentKey the key of the parent subject
   * @param channel the channel type (e.g. phone, email, web) to look for
   * @returns the favorite address fo the given channel or null
   */
  public getFavoriteAddressByChannel(parentKey: string, channel: AddressChannel): Observable<AddressModel | null> {
    const _path = `${CollectionNames.Subject}/${parentKey}`;
    return this.dataService.searchData(`${CollectionNames.Subject}/${parentKey}/${CollectionNames.Address}`, [
      { key: 'category', operator: '==', value: channel },
      { key: 'isFavorite', operator: '==', value: true }
    ]).pipe(map(_addresses => {
      if (_addresses.length > 1) die(`AddressUtil.getFavoriteAddressByChannel -> ERROR: only one favorite adress can exist per channel type (${_path})`);
      if (_addresses.length === 1) return _addresses[0];
      return null;
    })) as Observable<AddressModel | null>;
  }

  /***************************  bank account / payment slip *************************** */
  /**
   * Make a photo or upload the image of a QR payment slip into Firestorage and return the download URL.
   * @param parentKey  the key of the parent model (an org or person)
   * @param parentType the type of the parent model (an org or person)
   */
  public async uploadEzs(parentKey: string, parentType: ModelType): Promise<string | undefined> {
    const _photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: this.platform.is('mobile') ? CameraSource.Prompt : CameraSource.Photos 
    });
    return this.uploadFile(_photo, parentKey, parentType);
  }

  /**
   * Upload the image of the payment slip into Firestorage and return the download URL.
   * @param photo the photo of the payment slip
   * @param parentKey the key of the parent model (an org or person)
   * @param parentType the type of the parent model (an org or person)
   * @returns the download URL of the uploaded image
   */
  protected async uploadFile(photo: Photo, parentKey: string, parentType: ModelType): Promise<string | undefined> {
    const _file = await readAsFile(photo, this.platform);
    const _path = this.getDocumentStoragePath(parentKey, parentType);
    const _modal = await this.modalController.create({
      component: UploadTaskComponent,
      cssClass: 'upload-modal',
      componentProps: {
        file: _file,
        fullPath: _path + '/' + _file.name,
        title: '@document.operation.upload.ezs'
      }
    });
    _modal.present();
    try {
      const { data, role } = await _modal.onWillDismiss();    // data contains the Firestorage download URL
      if (role === 'confirm') {
        return data as string;    // return the firebase storage download URL
      }
    }
    catch (_ex) {
      error(undefined, 'AddressService.uploadFile -> ERROR: ' + JSON.stringify(_ex));
    }
    return undefined;
  }

  /**
   * Construct the path to the location of the payment slip in Firestorage.
   * tenant / model-slug: person | org / parent-key / ezs / file name
   * @param parentKey 
   * @param parentType 
   * @returns 
   */
  private getDocumentStoragePath(parentKey: string, parentType: ModelType): string {
    return `${this.env.auth.tenantId}/${getModelSlug(parentType)}/${parentKey}/${EZS_DIR}`;
  }
}