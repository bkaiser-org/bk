import { Route } from '@angular/router';
import {
  isAdminGuard,
  isAuthenticatedGuard,
  isPrivilegedGuard,
} from '@bk/base';
import {
  ContentPageComponent,
  MenuItemAllListComponent,
  PageAllListComponent,
  SectionAllListComponent,
  SectionPageComponent,
} from '@bk/content';
import { LoginPageComponent, PasswordResetPageComponent } from '@bk/auth';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'public/welcome' },
  {
    path: 'public',
    children: [
      {
        path: 'welcome',
        loadComponent: () =>
          import('@bk/cms').then((m) => m.BkWelcomePageComponent),
      },
      {
        path: 'notfound',
        loadComponent: () =>
          import('@bk/cms').then((m) => m.PageNotFoundComponent),
      },
      { path: ':id', component: ContentPageComponent },
    ],
  },
  {
    path: 'private',
    canActivate: [isAuthenticatedGuard],
    children: [
      {
        path: 'weather',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () =>
          import('@bk/cms').then((m) => m.WeatherPageComponent),
        data: { preload: true },
      },
      {
        path: 'geotracker',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () =>
          import('@bk/cms').then((m) => m.GeotrackerPageComponent),
      },
      {
        path: 'counter',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () =>
          import('@bk/cms').then((m) => m.CounterPageComponent),
      },
      {
        path: ':id',
        canActivate: [isAuthenticatedGuard],
        component: ContentPageComponent,
      },
    ],
  },
  {
    path: 'person',
    canActivate: [isAuthenticatedGuard],
    children: [
      {
        path: 'all',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () =>
          import('@bk/subject').then((m) => m.PersonAllListComponent),
      },
      {
        path: 'profile',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () =>
          import('@bk/subject').then((m) => m.ProfilePageComponent),
        data: { preload: true },
      },
      {
        path: 'new',
        canActivate: [isPrivilegedGuard],
        loadComponent: () =>
          import('@bk/subject').then((m) => m.PersonNewPageComponent),
      },
      {
        path: ':id',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () =>
          import('@bk/subject').then((m) => m.PersonPageComponent),
        data: { preload: true },
      },
    ],
  },
  {
    path: 'org',
    canActivate: [isAuthenticatedGuard],
    children: [
      {
        path: 'all',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () =>
          import('@bk/subject').then((m) => m.OrgAllListComponent),
      },
      {
        path: 'new',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () =>
          import('@bk/subject').then((m) => m.OrgNewPageComponent),
      },
      {
        path: ':id',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () =>
          import('@bk/subject').then((m) => m.OrgPageComponent),
      },
    ],
  },
  {
    path: 'group',
    canActivate: [isAuthenticatedGuard],
    children: [
      {
        path: 'all',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () =>
          import('@bk/subject').then((m) => m.GroupAllListComponent),
      },
      {
        path: 'new',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () =>
          import('@bk/subject').then((m) => m.OrgNewPageComponent),
      },
      {
        path: ':id',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () =>
          import('@bk/subject').then((m) => m.OrgPageComponent),
      },
    ],
  },
  {
    path: 'document',
    children: [
      {
        path: 'all',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () =>
          import('@bk/document').then((m) => m.DocumentAllListComponent),
        data: { preload: true },
      },
    ],
  },
  {
    path: 'event',
    children: [
      {
        path: 'all',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () =>
          import('@bk/event').then((m) => m.EventAllListComponent),
        data: { preload: true },
      },
      {
        path: 'yearly',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () =>
          import('@bk/event').then((m) => m.EventYearlyListComponent),
        data: { preload: true },
      }
    ],
  },
  {
    path: 'resource',
    canActivate: [isAuthenticatedGuard],
    children: [
      {
        path: 'all',
        canActivate: [isPrivilegedGuard],
        loadComponent: () =>
          import('@bk/resource').then((m) => m.ResourceAllListComponent),
        data: { preload: true },
      },
      {
        path: 'new',
        canActivate: [isPrivilegedGuard],
        loadComponent: () =>
          import('@bk/resource').then((m) => m.ResourceNewPageComponent),
      },
      {
        path: ':id',
        canActivate: [isPrivilegedGuard],
        loadComponent: () =>
          import('@bk/resource').then((m) => m.ResourcePageComponent),
      },
    ],
  },
  {
    path: 'aoc',
    canActivate: [isAdminGuard],
    children: [
      {
        path: 'roles',
        canActivate: [isAdminGuard],
        loadComponent: () =>
          import('@bk/aoc').then((m) => m.RolesPageComponent),
      },
      {
        path: 'adminops',
        canActivate: [isAdminGuard],
        loadComponent: () => import('@bk/aoc').then((m) => m.AdminOpsComponent),
      },
      {
        path: 'firebase-storage',
        canActivate: [isAdminGuard],
        loadComponent: () =>
          import('@bk/aoc').then((m) => m.FirebaseStorageComponent),
      },
    ],
  },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginPageComponent },
      { path: 'pwdreset', component: PasswordResetPageComponent },
    ],
  },
  {
    path: 'page',
    canActivate: [isAuthenticatedGuard],
    children: [
      {
        path: 'all',
        canActivate: [isPrivilegedGuard],
        component: PageAllListComponent,
      },
    ],
  },
  {
    path: 'section',
    canActivate: [isAuthenticatedGuard],
    children: [
      {
        path: 'all',
        canActivate: [isPrivilegedGuard],
        component: SectionAllListComponent,
      },
      {
        path: ':id',
        canActivate: [isPrivilegedGuard],
        component: SectionPageComponent,
      },
    ],
  },
  {
    path: 'menu',
    canActivate: [isAuthenticatedGuard],
    children: [
      {
        path: 'all',
        canActivate: [isPrivilegedGuard],
        component: MenuItemAllListComponent,
      },
    ],
  },
  {
    path: 'task',
    children: [
      {
        path: 'all',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () =>
          import('@bk/task').then((m) => m.TaskAllListComponent),
        data: { preload: true },
      },
    ],
  },
  {
    path: 'trip',
    children: [
      {
        path: 'all',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () =>
          import('@bk/trip').then((m) => m.TripAllListComponent),
        data: { preload: true },
      },
    ],
  },
  {
    path: 'competitionLevel/all',
    canActivate: [isAuthenticatedGuard],
    loadComponent: () =>
      import('@bk/competition-level').then(
        (m) => m.CompetitionLevelAllListComponent
      ),
  },
  {
    path: 'invoicePosition',
    canActivate: [isAuthenticatedGuard],
    children: [
      {
        path: 'all',
        canActivate: [isPrivilegedGuard],
        loadComponent: () =>
          import('@bk/invoice-position').then(
            (m) => m.InvoicePositionAllListComponent
          ),
        data: { preload: true },
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('@bk/cms').then((m) => m.PageNotFoundComponent),
  },
];
