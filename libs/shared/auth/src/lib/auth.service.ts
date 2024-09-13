import { Injectable, computed, inject, signal } from "@angular/core";
import { AUTH, bkTranslate, die, navigateByUrl, showToast, warn, ConfigService } from "@bk/util";
import { AuthError, User, browserLocalPersistence, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, setPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { authState } from 'rxfire/auth';
import { ToastController } from "@ionic/angular";
import { Router } from "@angular/router";
import { tap } from "rxjs";

/**
 * This provider centralizes the authentication functions
 * so that it is available several times by calling it from the provider.
 * This authentication implementation connects to a Firebase back-end with email/pwd authentication.
 * see: https://medium.com/javascript-in-plain-english/how-to-add-firebase
 * -authentication-to-pwa-or-angular-project-using-angularfire-83a8f61d367c
 * or Josh Morony: Creating Ionic Apps Angular Expert (chapter 4 CamperChat, p700)
 * 11.7.2023/bk rewriting to use signals
 * 12.8.2023/bk adding DataState and upgrading to AngularFire 7.6 with new API
 * 18.11.2023/bk rewriting to use rxfire
 * 21.11.2023/bk moved user related state into UserService and AuthorizationService
 * 30.8.2024/bk replaced ngxtension/connect with redux-like pattern (see https://www.youtube.com/watch?v=rHQa4SpekaA )
 */

export type FirebaseUser = User | null | undefined;

interface AuthenticationState {
  firebaseUser: FirebaseUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(AUTH);
  private toastController = inject(ToastController);
  private router = inject(Router);
  private configService = inject(ConfigService);

  private toastLength = this.configService.getConfigNumber('settings_toast_length');
  private loginUrl = this.configService.getConfigString('cms_login_url');

  // sources
  private user$ = authState(this.auth);

  // state
  private state = signal<AuthenticationState>({
    firebaseUser: undefined,
  });

  // selectors
  public currentFirebaseUser = computed(() => this.state().firebaseUser);
  public currentFirebaseUid = computed(() => this.currentFirebaseUser()?.uid ?? undefined);
  public currentLoginEmail = computed(() => this.currentFirebaseUser()?.email ?? undefined);
  public isAuthenticated = computed(() => this.currentFirebaseUser() ? true : false);

  /*-------------------------- reducers --------------------------------*/
  constructor() {

    // reducers
    this.user$.pipe(
      tap(firebaseUser => this.setFirebaseUser(firebaseUser)));
    onAuthStateChanged(this.auth, (user) => {
      this.setFirebaseUser(user);
    });
  }

  private setFirebaseUser(firebaseUser: User | null): void {
    this.state.update(_state => ({ ..._state, firebaseUser: firebaseUser }));
  }

  /*-------------------------- login / logout / password reset --------------------------------*/
  /**
   * Login a returning user with already existing credentials.
   * @param loginEmail the uid (an email address)
   * @param passwort the user password
   */
  public async login(loginEmail: string, password: string, url = this.configService.getConfigString('cms_root_url')): Promise<void> {
    try {
      if (!loginEmail || loginEmail.length === 0 || !password || password.length === 0) die('AuthService.login: email and password are mandatory.');
      /*  browserLocalPersistence indicates that the state will be persisted even when the browser window is closed. 
          An explicit sign out is needed to clear that state. 
          Note that Firebase Auth web sessions are single host origin and will be persisted for a single domain only.
          see: https://firebase.google.com/docs/auth/web/auth-state-persistence
          browserLocalPersistence, browserSessionPersistence, inMemoryPersistence
      */
      await setPersistence(this.auth, browserLocalPersistence);
      await signInWithEmailAndPassword(this.auth, loginEmail, password);
      showToast(this.toastController, '@auth.operation.login.confirmation', this.toastLength);
      await navigateByUrl(this.router, url);  
    } 
    catch(_ex) {
      console.error('AuthService.login: error: ', _ex);
      await showToast(this.toastController, '@auth.operation.login.error', this.toastLength);
      await navigateByUrl(this.router, this.loginUrl)
    }
  }

  /**
   * Send a reset password link to an email address of a user who forgot her password.
   * @param email an email address of a user
   */
  public async resetPassword(email: string): Promise<void> {
    try {
      if (!email || email.length === 0) die('AuthService.resetPassword: email is mandatory.');
      await sendPasswordResetEmail(this.auth, email);
      await showToast(this.toastController, bkTranslate('@auth.operation.pwdreset.confirmation') + email, this.toastLength);
      await navigateByUrl(this.router, this.loginUrl)
    } 
    catch (_ex) {
      console.error('AuthService.resetPassword: error: ', _ex);
      await showToast(this.toastController, '@auth.operation.pwdreset.error', this.toastLength);
      await navigateByUrl(this.router, this.loginUrl)
    }
  }

  public async logout(): Promise<boolean> {
    try {
      await signOut(this.auth);
      await showToast(this.toastController, '@auth.operation.logout.confirmation', this.toastLength);
      return Promise.resolve(true);
    } 
    catch (_ex) {
      console.error('AuthService.logout: error: ', _ex);
      await showToast(this.toastController, '@auth.operation.logout.error', this.toastLength);
      return Promise.resolve(false);
    }
  }

  /*-------------------------- helpers --------------------------------*/
  /**
   * Try to create a new Firebase account with the given email address.
   * On successful creation of the user account, this new user is signed in. That's why we update the user to the former current user.
   * @param email the login email address of the user
   * @returns the uid of the new Firebase account or the existing Firebase account or undefined if there was an error.
   */
  public async createFirebaseAccount(email: string): Promise<string | undefined> {
    // save the current user
    const _currentUser = this.currentFirebaseUser();
    try {
      const _fbuser = await createUserWithEmailAndPassword(this.auth, email, this.configService.getInitialPassword());
      await showToast(this.toastController, '@auth.operation.create.confirmation', this.toastLength);
      await this.updateUser(_currentUser); // reset the logged-in user
      return _fbuser.user.uid;
    } catch (_ex) {
      const _error = _ex as AuthError;
      let _uid = undefined;
      switch (_error.code) {
        case 'auth/email-already-in-use':
          warn(`Email address ${email} already in use.`);
          _uid = this.getFirebaseUid(email, this.configService.getInitialPassword());
          break;
        case 'auth/invalid-email':
          warn(`Email address ${email} is invalid.`);
          break;
        case 'auth/operation-not-allowed':
          warn(`Error during sign up (not allowed).`);
          break;
        case 'auth/weak-password':
          warn('Password is not strong enough. Add additional characters including special characters and numbers.');
          break;
        default:
          warn(_error.message);
          break;
      }
      await this.updateUser(_currentUser); // reset the logged-in user
      return _uid;
    }
  }

  /**
   * Set the provided user as the new current user.
   * @param user 
   */
  public async updateUser(user: FirebaseUser): Promise<void> {
    if (user) {
      await this.auth.updateCurrentUser(user);
    }
  }

  /**
   * Retrieve the uid of the user with the given login email.
   * This will fail if the user does not exist or the password is wrong.
   * @param email 
   * @param password 
   * @returns 
   */
  public async getFirebaseUid(email: string, password: string): Promise<string | undefined> {
    try {
      const _fbCredentials = await signInWithEmailAndPassword(this.auth, email, password);
      return _fbCredentials.user.uid;
    }
    catch(_ex) {
      warn(`AuthService.getFirebaseUid: error: ${_ex}`);
      return undefined;
    }
  }
}
