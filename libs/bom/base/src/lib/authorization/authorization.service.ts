import { computed, inject, Injectable, signal } from '@angular/core';
import { AUTH, CollectionNames, die, warn } from '@bk/util';
import { BaseModel, RoleName, Roles, UserModel } from '@bk/models';
import { DataService } from '../models/data.service';
import { Observable, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { authState } from 'rxfire/auth';
 
interface AuthorizationState {
  currentUser: UserModel | undefined;
  isLoading: boolean;
  error: string | undefined;
}

@Injectable({
    providedIn: 'root'
})
export class AuthorizationService {
  private auth = inject(AUTH);
  private dataService = inject(DataService);

  // sources
  private user$ = authState(this.auth);

  // state
  private state = signal<AuthorizationState>({
    currentUser: undefined,
    isLoading: false,
    error: undefined
  });

  // selectors
  public currentUser = computed(() => this.state().currentUser);
  public isLoading = computed(() => this.state().isLoading);
  public error = computed(() => this.state().error);
  public showDebugInfo = computed(() => this.currentUser() ? this.currentUser()?.showDebugInfo : false);

  /*-------------------------- reducers --------------------------------*/
  constructor() {
    this.user$.subscribe(firebaseUser => console.log('AuthorizationService: firebaseUid: ', firebaseUser?.uid));
    this.user$.pipe(
      tap(() => this.setLoadingIndicator(true)),
      switchMap(firebaseUser => this.getUserByUid(firebaseUser?.uid)),
      takeUntilDestroyed()
    ).subscribe(_user => this.setCurrentUser(_user));
  }

  private setLoadingIndicator(isLoading: boolean): void {
    if (this.showDebugInfo()) {
      console.log('AuthorizationService.setLoadingIndicator: isLoading: ', isLoading);
    }
    this.state.update(() => ({ currentUser: undefined, isLoading: isLoading, error: undefined }));
  }

  private setCurrentUser(user: BaseModel | undefined): void {
    if (this.showDebugInfo()) {
      console.log('AuthorizationService.setCurrentUser: user: ', user);
    }
    this.state.update(() => ({ currentUser: user as UserModel, isLoading: false, error: undefined }));
  }

  private setError(error: string | undefined): void {
    if (this.showDebugInfo()) {
      console.log('AuthorizationService.setError: error: ', error);
    }
    this.state.update(() => ({ currentUser: undefined, isLoading: false, error: error }));
  }

  private resetState(): void {
    this.state.update(() => ({ currentUser: undefined, isLoading: false, error: undefined }));
  }

  private getUserByUid(uid: string | undefined): Observable<BaseModel | undefined> {
    if (this.showDebugInfo()) {
      console.log('AuthorizationService.getUserByUid: uid: ', uid);
    }
    try {
      return this.dataService.readModel(CollectionNames.User, uid, false);
    }
    catch (_ex) {
      warn('AuthorizationService.getUserByUid: error: ' + JSON.stringify(_ex));
      this.setError(JSON.stringify(_ex));
      return of(undefined);
    }
  }

  /*-------------------------- access control --------------------------------*/
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
      case 'public': _roles = ['public']; break; // only non-authenticated users
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
    const _currentUser = this.currentUser();
    if (!_currentUser) {
      return allowedRoles.includes('public');
    }
    for (const role of allowedRoles) {
      if (_currentUser.roles[role as keyof Roles] === true) {
        return true;
      }
    }
    return false;
  }
}
