import { Inject } from "@angular/core";
import { InjectionToken } from "@angular/core";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { ENV } from "./app-tokens";

export const AUTH_EMULATOR_PORT = 9099;

export const AUTH = new InjectionToken('Firebase auth', {
  providedIn: 'root',
  factory: () => {
    const auth = getAuth();
    const _env = Inject(ENV);

    if (_env.useEmulators) {
      connectAuthEmulator(auth, `http://localhost:${AUTH_EMULATOR_PORT}`, {
        disableWarnings: true,
      });
    }
    return auth;
  },
});