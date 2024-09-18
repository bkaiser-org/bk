import { Injectable, inject } from "@angular/core";
import { AvatarModel } from "@bk/models";
import { doc, setDoc } from "firebase/firestore";
import { CollectionNames, FIRESTORE, error, getAvatarUrl, ENV, isImage, isPdf } from "@bk/util";
import { docData } from "rxfire/firestore";
import { Observable, firstValueFrom, of } from "rxjs";
import { getAvatarKey, getLogoUrlByModel, newAvatarModel, readAsFile } from "./avatar.util";
import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
import { ModelType } from "@bk/categories";
import { ModalController, Platform } from "@ionic/angular/standalone";
import { UploadTaskComponent } from "../upload-task.modal";

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private modalController = inject(ModalController);
  private platform = inject(Platform);
  private firestore = inject(FIRESTORE);
  private env = inject(ENV);

  public photos: UserPhoto[] = [];

/**
 * Save a model as a new Firestore document into the database. 
 * We use a combination of the modelType and mkey as the document ID.
 * This function uses setdoc() to overwrite a document with the same ID. If the document does not exist, it will be created.
 * If the document does exist, its contents will be overwritten with the newly provided data.
 * @param model the avatar data to save
 * @returns a Promise of the key of the newly stored model
 */
  public async updateOrCreateAvatar(avatar: AvatarModel): Promise<string> {
    const _key = getAvatarKey(avatar);
    const _ref = doc(this.firestore, CollectionNames.Avatar, _key);
    try {
      // we need to convert the custom object to a pure JavaScript object (e.g. arrays)
      await setDoc(_ref, JSON.parse(JSON.stringify(avatar)));
      return Promise.resolve(_ref.id);
    }
    catch (_ex) {
      console.error(`AvatarService.updateOrCreateAvatar -> ERROR on path=${CollectionNames.Avatar}/${_ref.id}:`, _ex);
      return Promise.reject(new Error('Failed to create model'));
    }
  }

    // key  =  modelType[.relationshipType].mkey, e.g. 15.1.1123123asdf
  public readAvatar(key: string, showError = true): Observable<AvatarModel | undefined> {
    try {
      return docData(doc(this.firestore, `${CollectionNames.Avatar}/${key}`)) as Observable<AvatarModel>;
    }
    catch (_ex) {
      if (showError) {
        console.error(`AvatarService.readAvatar(${CollectionNames.Avatar}/${key}) -> ERROR: `, _ex);
        error(undefined, 'Failed to read avatar');  
      }
      return of(undefined);
    }  
  }

  // key  =  modelType[.relationshipType].mkey, e.g. 15.1.1123123asdf
  // this returns a relative imgix url (without the imgix base url). this is suitable for the bk-img component.
  // if no Avatar information is found, it returns undefined.
  // the image is in squared format, centered to the portrait.
  public async getAvatarUrl(key: string): Promise<string | undefined> {
    const _avatar = await firstValueFrom(this.readAvatar(key));
    if (!_avatar) return undefined;
    if (isPdf(_avatar.storagePath)) {
      return _avatar.storagePath + '&page=1&ar=1:1';
    }
    if (isImage(_avatar.storagePath)) {
      return _avatar.storagePath + '?auto=format,compress,enhance&ar=1:1&fit=clamp';
    }
    return undefined;  
  }

  // this.returns an absolute imgix url (with the imgix base url). this is suitable for the img elements.
  // if no Avatar information is found, it returns the default logo for the modelType.
  public async getAbsoluteAvatarUrl(key: string, size = this.env.thumbnail.width): Promise<string> {
    const _avatar = await firstValueFrom(this.readAvatar(key));
    if (!_avatar) {
      const _modelType = parseInt(key.split('.')[0]);
      return `${this.env.app.imgixBaseUrl}/${getLogoUrlByModel(_modelType)}`;
    } else {
      return `${this.env.app.imgixBaseUrl}/${getAvatarUrl(_avatar.storagePath, size)}`;
    }
  }

  public async uploadPhoto(photo: Photo, modelType: ModelType, key: string): Promise<void> {
    const _file = await readAsFile(photo, this.platform);

    if (key) {
      const _avatar = newAvatarModel(this.env.auth.tenantId, modelType, key, _file.name)
      const _modal = await this.modalController.create({
        component: UploadTaskComponent,
        cssClass: 'upload-modal',
        componentProps: {
          file: _file,
          fullPath: _avatar.storagePath,
          title: '@document.operation.upload.avatar.title'
        }
      });
      _modal.present();

      const { role } = await _modal.onWillDismiss();

      if (role === 'confirm') {
        await this.updateOrCreateAvatar(_avatar);
      }
    }
  }

  public async takePhoto(): Promise<Photo> {
    return await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
  }
}