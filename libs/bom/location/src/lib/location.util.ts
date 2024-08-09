import { LocationType, ModelType } from "@bk/categories";
import { LocationFormModel, LocationModel } from "@bk/models";

export function getLocationSearchIndex(location: LocationModel): string {
  return 'n:' + location.name + ' w:' + location.what3words;
}

export function getLocationSearchIndexInfo(): string {
  return 'n:ame w:hat3words';
}

export function getLocationTitle(locationKey: string | undefined): string {
  const _operation = !locationKey ? 'create' : 'update';
  return `@location.operation.${_operation}.label`;  
}


// Cloud Functions
// tbd: convert coordinates to what3words
// tbd: convert what3words to coordinates
// tbd: convert coordinates to address
// tbd: convert address to coordinates
// tbd: convert what3words to address
// tbd: convert address to what3words
// tbd: convert coordinates to placeid
// tbd: convert placeid to coordinates

export function newLocationFormModel(): LocationFormModel {
  return {
    bkey: '',
    name: '',
    locationType: LocationType.Address,
    latitude: 0,
    longitude: 0,
    placeId: '',
    what3words: '',
    height: 406,
    speed: 0,
    direction: 0,
    url: '',
    notes: '',
    tags: '',
    modelType: ModelType.Location
  }
}

export function convertLocationToForm(location: LocationModel | undefined): LocationFormModel {
  if (!location) return newLocationFormModel();
  return {
    bkey: location.bkey,
    name: location.name,
    locationType: location.category,
    latitude: location.latitude,
    longitude: location.longitude,
    placeId: location.placeId,
    what3words: location.what3words,
    height: location.height,
    speed: location.speed,
    direction: location.direction,
    url: location.url,
    notes: location.description,
    tags: location.tags,
    modelType: ModelType.Location
  }
}

export function convertFormToLocation(vm: LocationFormModel): LocationModel {
  const _location = new LocationModel();
  _location.bkey = vm.bkey ?? ''; 
  _location.name = vm.name ?? '';
  _location.category = vm.locationType ?? LocationType.Address;
  _location.latitude = vm.latitude ?? 0;
  _location.longitude = vm.longitude ?? 0;
  _location.placeId = vm.placeId ?? '';
  _location.what3words = vm.what3words ?? '';
  _location.height = vm.height ?? 0;
  _location.speed = vm.speed ?? 0;
  _location.direction = vm.direction ?? 0;
  _location.url = vm.url ?? '';
  _location.tags = vm.tags ?? '';
  _location.description = vm.notes ?? '';
  return _location;
}