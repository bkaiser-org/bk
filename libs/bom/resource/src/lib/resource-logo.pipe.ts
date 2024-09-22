import { inject, Pipe, PipeTransform } from '@angular/core';
import { ResourceType } from '@bk/categories';
import { getResourceLogo } from './resource.util';
import { ENV } from '@bk/util';

@Pipe({
  name: 'resourceLogo',
  standalone: true,
})
export class ResourceLogoPipe implements PipeTransform {
  private env = inject(ENV);

  transform(resourceType: ResourceType): string {
    const _iconName = getResourceLogo(resourceType);
    return `${this.env.app.imgixBaseUrl}/logo/ionic/${_iconName}.svg`;
  }
}