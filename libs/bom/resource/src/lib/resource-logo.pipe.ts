import { Pipe, PipeTransform } from '@angular/core';
import { ResourceType } from '@bk/categories';
import { getResourceLogo } from './resource.util';

@Pipe({
  name: 'resourceLogo',
  standalone: true,
})
export class ResourceLogoPipe implements PipeTransform {

  transform(resourceType: ResourceType): string {
    return getResourceLogo(resourceType);
  }
}