import { Pipe, PipeTransform, inject } from '@angular/core';
import { AvatarService } from './avatar.service';

@Pipe({
  name: 'avatar',
  standalone: true
})
export class AvatarPipe implements PipeTransform {
  private avatarService = inject(AvatarService);

  transform(key: string): Promise<string> {
    return this.avatarService.getAbsoluteAvatarUrl(key);
  }
}
