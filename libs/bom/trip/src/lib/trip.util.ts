import { CategoryType, ModelType } from "@bk/categories";
import { TripFormModel, TripModel } from "@bk/models";

export function getTripSearchIndex(trip: TripModel): string {
  return 'n:' + trip.name + ' s:' + trip.startDateTime;
}

export function getTripSearchIndexInfo(): string {
  return 'n:ame s:tartDateTime';
}

export function getTripTitle(tripKey: string | undefined): string {
  const _operation = !tripKey ? 'create' : 'update';
  return `@trip.operation.${_operation}.label`;  
}

export function newTripFormModel(): TripFormModel {
  return {
    bkey: '',
    name: '',
    startDateTime: '',
    endDateTime: '',
    resourceKey: '',
    locations: [],
    persons: [],
    url: '',
    notes: '',
    tags: '',
    modelType: ModelType.Trip
  }
}


export function convertTripToForm(trip: TripModel | undefined): TripFormModel {
  if (!trip) return newTripFormModel();
  return {
    bkey: trip.bkey,
    name: trip.name,
    startDateTime: trip.startDateTime,
    endDateTime: trip.endDateTime,
    resourceKey: trip.resourceKey,
    locations: trip.locations,
    persons: trip.persons,
    url: trip.url,
    notes: trip.description,
    tags: trip.tags,
    modelType: ModelType.Trip
  }
}

export function convertFormToTrip(vm: TripFormModel): TripModel {
  const _trip = new TripModel();
  _trip.bkey = vm.bkey ?? ''; 
  _trip.name = vm.name ?? '';
  _trip.category = CategoryType.Undefined;
  _trip.startDateTime = vm.startDateTime ?? '';
  _trip.endDateTime = vm.endDateTime ?? '';
  _trip.resourceKey = vm.resourceKey ?? '';
  _trip.locations = vm.locations ?? [];
  _trip.persons = vm.persons ?? [];
  _trip.url = vm.url ?? '';
  _trip.tags = vm.tags ?? '';
  _trip.description = vm.notes ?? '';
  return _trip;
}