// flag based preloading strategy
// source: https://dev.to/this-is-angular/optimize-your-angular-apps-user-experience-with-preloading-strategies-3ie7
import { Injectable } from "@angular/core";
import { PreloadingStrategy, Route } from "@angular/router";

import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class FlagBasedPreloadingStrategy extends PreloadingStrategy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return route.data?.["preload"] === true ? load() : of(null);
  }
}