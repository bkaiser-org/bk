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
    case ModelType.User: return 'assets/models/person.png';
    case ModelType.Org: return 'assets/models/org.png';
    case ModelType.Boat: return 'assets/models/boat.png';
    case ModelType.Resource: return 'assets/models/tool.png';
    case ModelType.Group: return 'assets/models/group.png';
    case ModelType.Event: return 'assets/models/event.png';
    case ModelType.Page:
    case ModelType.Section:
    case ModelType.Document: return 'assets/models/doc.png';
    case ModelType.Locker: return 'assets/models/lock.png';
    case ModelType.HouseKey: return 'assets/models/key.png';
    case ModelType.Location: return 'assets/models/location.png';
    case ModelType.Application:
    case ModelType.Relnote:  return 'assets/models/text.png';
    case ModelType.Comment: return 'assets/models/chat.png';
    case ModelType.Menu: 
    case ModelType.MenuItem: return 'assets/models/menu.png';
    case ModelType.Task: return 'assets/models/task.png';
    case ModelType.Trip: return 'assets/models/trip.png';
    case ModelType.CompetitionLevel: return 'assets/models/competition.png';
    case ModelType.InvoicePosition:  return 'assets/models/money.png';
    case ModelType.Address:  return 'assets/models/address.png';
    case ModelType.Relationship:  return 'assets/models/relationship.png';
    default:  return 'assets/models/bullet.png';
  }

}