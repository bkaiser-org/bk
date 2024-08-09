import { Injectable, inject } from '@angular/core';
import { DataService } from '@bk/base';
import { ModelType } from '@bk/categories';
import { Observable, map } from 'rxjs';
import { SubjectModel } from '@bk/models';
import { CollectionNames, navigateByUrl } from '@bk/util';
import { BirthdayInfo, getBirthdayList } from './birthday.util';
import { Params, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BirthdayService {
  private dataService = inject(DataService);
  private router = inject(Router);
  public allBirthdays$: Observable<BirthdayInfo[]> | undefined;
  public birthdays$: Observable<BirthdayInfo[]> | undefined;

  // internally, we use all subjects with modelType = Person as the starting point (ie. all persons)
  // currently, we ignore the list type MembersSscActive
  // later, we should only use the members, not all persons

  /*-------------------------- CRUD operations --------------------------------*/

  /**
   * Load the subjects from the database, convert the subjects into birthday info, then sort the list by days.
   */
  public initialize(): void {
    this.allBirthdays$ = this.dataService.listModelsBySingleQuery(CollectionNames.Subject, 'modelType', ModelType.Person)
      .pipe(map((_persons) => getBirthdayList(_persons as SubjectModel[])));
    this.birthdays$ = this.allBirthdays$;
  }

  public async navigateToUrl(url: string | undefined, queryParams?: Params): Promise<void> {
    navigateByUrl(this.router, url, queryParams);
  }

  public onSearchtermChange($event: Event): void {
    const _searchTerm = ($event.target as HTMLInputElement).value as unknown as string;
    if (!_searchTerm || _searchTerm.length === 0) {
      this.birthdays$ = this.allBirthdays$;
    } else {
      const _term = _searchTerm.toLowerCase();
      this.birthdays$ = this.allBirthdays$?.pipe(map(_birthdays => _birthdays.filter(_birthday => (_birthday.index.includes(_term)))));
    }
  }
}
