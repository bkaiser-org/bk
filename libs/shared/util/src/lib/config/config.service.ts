/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRemoteConfig, getValue, fetchAndActivate } from "firebase/remote-config";
import { die, generateRandomString } from "../log.util";
import { Injectable, inject } from "@angular/core";
import { ENV } from "./app-tokens";

// To access remote config, see https://firebase.google.com/docs/remote-config/get-started?platform=web
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public env: any = inject(ENV);
  public remoteConfig = getRemoteConfig();
  public isProduction = this.env.production;
  public useEmulators = this.env.useEmulators;

  constructor() {
    try {
      this.remoteConfig.defaultConfig = { ...this.env.remote_config_defaults };
      this.remoteConfig.settings.minimumFetchIntervalMillis = this.env.minimumConfigFetchInterval;
      this.fetchRemoteConfig();
    }
    catch(_ex) {
      die('ConfigService.constructor: error initializing remote config: ' + JSON.stringify(_ex));
    }
  }

  private async fetchRemoteConfig() {
    try {
      await fetchAndActivate(this.remoteConfig);
    } catch (err) {
      console.error('Firebase Remote Config fetch failed:', err);
    }
  }

  public getConfigString(key: string): string {
    return getValue(this.remoteConfig, key).asString();
  }

  public getConfigNumber(key: string): number {
    return getValue(this.remoteConfig, key).asNumber();
  }

  public getConfigBoolean(key: string): boolean {
    return getValue(this.remoteConfig, key).asBoolean();
  }

  // we do not need to know the initial password as it is anyway reset by the user
  public getInitialPassword(): string {
    return generateRandomString(12);
  }

  public getAvailableLanguages(): string[] {
    return JSON.parse(getValue(this.remoteConfig, 'i18n').asString()) as string[];
  }
}

