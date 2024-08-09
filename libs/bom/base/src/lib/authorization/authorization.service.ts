import { effect, inject, Injectable } from '@angular/core';
import { CollectionNames, die } from '@bk/util';
import { RoleName, Roles, UserModel } from '@bk/models';
import { AuthService } from '@bk/auth';
import { DataService } from '../models/data.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthorizationService {
  private authService = inject(AuthService);
  private dataService = inject(DataService);
  public currentUser: UserModel | undefined;

  constructor() {
    effect(async () => {
      const _uid = this.authService.currentFirebaseUser()?.uid;
      if (_uid) {
        this.currentUser = await firstValueFrom(this.dataService.readModel(CollectionNames.User, _uid, false)) as UserModel;
      }
    });
  }

  public isAdmin(): boolean {
    return this.hasRole('admin');
  }

  public isPrivileged(): boolean {
    return this.hasRole('privileged');
  }
  
  public isPrivilegedOr(roleName: RoleName): boolean {
    return this.hasRole('privileged') || this.hasRole(roleName);
  }

  public hasRole(role: RoleName | undefined): boolean {
    if (!role) return true;
    let _roles: RoleName[] = [];
    switch(role) {  // add additional roles that also have access
      case 'none': return true;
      case 'registered': _roles = ['registered', 'privileged', 'contentAdmin', 'resourceAdmin', 'eventAdmin', 'memberAdmin', 'treasurer', 'admin']; break;
      case 'privileged': _roles = ['privileged', 'admin']; break;
      case 'memberAdmin': _roles = ['memberAdmin', 'admin']; break;
      case 'contentAdmin': _roles = ['contentAdmin', 'admin']; break;
      case 'resourceAdmin': _roles = ['resourceAdmin', 'admin']; break;
      case 'eventAdmin': _roles = ['eventAdmin', 'admin']; break;
      case 'treasurer': _roles = ['treasurer', 'admin']; break;
      case 'admin':  _roles = ['admin']; break;
      default: die('AuthUtil.hasRole: unknown role claimed: ' + role);
    }
    return this.checkAuthorization(_roles);
  }
  
  /**
  * Determines if the user has a matching role.
  * @param user 
  * @param allowedRoles a list of allowed roles to check for
  * @returns true if at least one role matches allowed roles
  */
  public checkAuthorization(allowedRoles: RoleName[]): boolean {
    if (!this.currentUser) return false;
    for (const role of allowedRoles) {
      if (this.currentUser.roles[role as keyof Roles] === true) {
        return true;
      }
    }
    return false;
  }
}
