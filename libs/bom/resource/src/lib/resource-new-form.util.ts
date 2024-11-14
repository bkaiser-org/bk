import { ResourceModel, ResourceNewFormModel } from "@bk/models";
import { BoatType, BoatUsage, ModelType, ResourceType } from "@bk/categories";
import { doubleNumber2name } from "@bk/util";


export function getResourceNewFormModel(modelType: ModelType | undefined, resourceType: ResourceType): ResourceNewFormModel {
  return {
    name: '',
    lockerNr: 0,
    keyNr: 0,
    category: resourceType,
    boatType: BoatType.b1x,
    boatUsage: BoatUsage.Breitensport,
    currentValue: 0,
    weight: 0,
    load: '',
    hexColor: '',
    notes: '',
    tags: '',
    modelType: modelType ?? ModelType.Resource
  };
}

export function convertNewFormToResource(vm: ResourceNewFormModel): ResourceModel {
  const _resource = new ResourceModel();
  if (vm.category === ResourceType.FemaleLocker || vm.category === ResourceType.MaleLocker) {
    _resource.name = doubleNumber2name(vm.lockerNr, vm.keyNr);
  } else {
    _resource.name = vm.name ?? '';
  }
  _resource.category = vm.category ?? ResourceType.Undefined;
  _resource.subType = vm.boatType ?? BoatType.b1x;
  _resource.usage = vm.boatUsage ?? BoatUsage.Breitensport;
  _resource.currentValue = parseInt(vm.currentValue + ''); // make sure it's a number (input returns string)
  _resource.weight = parseInt(vm.weight + ''); // make sure it's a number (input returns string)
  _resource.load = vm.load  ?? '';
  _resource.color = vm.hexColor ?? '';
  _resource.description = vm.notes ?? '';
  _resource.tags = vm.tags ?? '';
  return _resource;
}

