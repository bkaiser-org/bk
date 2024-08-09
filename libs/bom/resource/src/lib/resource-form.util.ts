import { BoatType, BoatUsage, ModelType, ResourceType } from '@bk/categories';
import { die, doubleNumber2name, name2numbers } from '@bk/util';
import { ResourceFormModel, ResourceModel, isLocker } from '@bk/models';

/* ----------------------------- */
export function convertResourceToForm(resource: ResourceModel | undefined): ResourceFormModel {
    if (!resource) die('ResourceFormUtil.convertResourceToForm: resource is undefined');
    let _lockerInfo = { number1: 0, number2: 0 };
    if (isLocker(resource)) {
        _lockerInfo = name2numbers(resource.name);
    }
    return {
      bkey: resource.bkey,
      name: resource.name,
      boatName: resource.name,
      keyName: resource.name,
      lockerNr: _lockerInfo.number1,
      keyNr: _lockerInfo.number2,
      resourceType: resource.category,
      boatType: resource.subType,
      boatUsage: resource.usage,
      currentValue: resource.currentValue,
      weight: resource.weight,
      load: resource.load,
      hexColor: resource.color,
      url: resource.url,
      notes: resource.description,
      tags: resource.tags,
      modelType: (resource.category === ResourceType.RowingBoat ? ModelType.Boat : ModelType.Resource)    
    }
}

export function convertFormToResource(resource: ResourceModel | undefined, vm: ResourceFormModel): ResourceModel {
    if (!resource) {
      resource = new ResourceModel();
    }

    resource.bkey = vm.bkey ?? '';
    // name <- boatName, keyName, lockerNr/keyNr, name
    switch (vm.resourceType) {
        case ResourceType.RowingBoat: resource.name = vm.boatName ?? ''; break;
        case ResourceType.HouseKey: resource.name = vm.keyName ?? ''; break;
        case ResourceType.FemaleLocker:
        case ResourceType.MaleLocker: resource.name = doubleNumber2name(vm.lockerNr, vm.keyNr); break;
        default: resource.name = vm.name ?? ''; break;
    }
    resource.category = vm.resourceType ?? ResourceType.Undefined;
    resource.subType = vm.boatType ?? BoatType.b1x;
    resource.usage = vm.boatUsage ?? BoatUsage.Breitensport1E;
    resource.currentValue = parseInt(vm.currentValue + ''); // make sure it's a number (input returns string)
    resource.weight = parseInt(vm.weight + ''); // make sure it's a number (input returns string)
    resource.load = vm.load ?? '';
    resource.color = vm.hexColor ?? '';
    resource.url = vm.url ?? '';
    resource.description = vm.notes ?? '';
    resource.tags = vm.tags ?? '';
    resource.modelType = vm.modelType ?? ModelType.Resource;

    return resource;
}
