import { CategoryType, ModelType, RelationshipType, getModelSlug, getSlugFromRelationshipType } from "@bk/categories";
import { AVATAR_DIR, AvatarModel } from "@bk/models";
import { blobToFile, die } from "@bk/util";
import { Photo } from "@capacitor/camera";
import { Filesystem } from "@capacitor/filesystem";
import { Platform } from "@ionic/angular";

export function newAvatarModel(tenantId: string, modelType: ModelType, key: string, fileName: string, relationshipType?: RelationshipType): AvatarModel {
  const _parts = fileName.split('.');
  if (_parts.length != 2) die('AvatarUtil.newAvatarModel: Invalid filename: ' + fileName);
  return {
    bkey: modelType + '.' + key,
    tenant: tenantId,
    modelType: modelType,
    relationshipType: relationshipType ?? CategoryType.Undefined,
    mkey: key,
    baseName: _parts[0],
    extension: _parts[1],
    storagePath: getAvatarStoragePath(tenantId, modelType, key, _parts[0], _parts[1], relationshipType)
  };
}

export function getAvatarStoragePath(tenantId: string, modelType: ModelType, key: string, baseName: string, extension: string, relationshipType?: RelationshipType): string {
  const _slug = relationshipType ? getSlugFromRelationshipType(relationshipType) : getModelSlug(modelType);
  return `${tenantId}/${_slug}/${key}/${AVATAR_DIR}/${baseName}.${extension}`;
}

export function getAvatarKey(avatar: AvatarModel): string {
  let _key = avatar.modelType + '';
  if (avatar.relationshipType !== CategoryType.Undefined) {
    _key = _key + '.' + avatar.relationshipType;
  }
  return _key + '.' + avatar.mkey;
}

  // https://ionicframework.com/docs/angular/your-first-app/3-saving-photos
export async function readAsFile(photo: Photo, platform: Platform): Promise<File> {
    if (platform.is('hybrid') && photo.path) {
      const _file = await Filesystem.readFile({
        path: photo.path
      });
      const _fileContent = _file.data;
      if (typeof(_fileContent) !== 'string') die('ProfilePage.readAsFile: _fileContent is not a string.');
      const _rawData = atob(_fileContent);
      const _bytes = new Array(_rawData.length);
      for (let x = 0; x < _rawData.length; x++) {
          _bytes[x] = _rawData.charCodeAt(x);
      }
      return blobToFile(new Blob([new Uint8Array(_bytes)], {type: 'image/' + photo.format}), new Date().getTime() + '.' + photo.format);
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      if (!photo.webPath) die('ProfilePage.readAsBase64: webPath is mandatory.');
      const _response = await fetch(photo.webPath);
      return blobToFile(await _response.blob(), new Date().getTime() + '.' + photo.format);
    }
  }


export function getLogoUrlByModel(modelType: ModelType): string {
  switch(modelType) {
    case ModelType.Person: 
    case ModelType.Subject:
    case ModelType.MembershipSubject:
    case ModelType.User: return 'logo/models/person.svg';
    case ModelType.Org: return 'logo/models/org.svg';
    case ModelType.Boat: return 'logo/models/boat.svg';
    case ModelType.Resource: return 'logo/models/tool.svg';
    case ModelType.Group: return 'logo/models/group.svg';
    case ModelType.Event: return 'logo/models/event.svg';
    case ModelType.Page:
    case ModelType.Section:
    case ModelType.Document: return 'logo/models/doc.svg';
    case ModelType.Locker: return 'logo/models/lock.svg';
    case ModelType.HouseKey: return 'logo/models/key.svg';
    case ModelType.Location: return 'logo/models/location.svg';
    case ModelType.Application:
    case ModelType.Relnote:  return 'logo/models/text.svg';
    case ModelType.Comment: return 'logo/models/chat.svg';
    case ModelType.Menu: 
    case ModelType.MenuItem: return 'logo/models/menu.svg';
    case ModelType.Task: return 'logo/models/task.svg';
    case ModelType.Trip: return 'logo/models/trip.svg';
    case ModelType.CompetitionLevel: return 'logo/models/competition.svg';
    case ModelType.InvoicePosition:  return 'logo/models/money.svg';
    case ModelType.Address:  return 'logo/models/address.svg';
    case ModelType.Relationship:  return 'logo/models/relationship.svg';
    default:  return 'logo/models/bullet.svg';
  }

}