import { Injectable, WritableSignal, computed, inject, signal } from "@angular/core";
import { CategoryType, FilterType, ListTypes, ModelType } from "@bk/categories";
import { EXPORT_FORMATS, ExportFormat, convertToTable } from "@bk/core";
import { CollectionNames, ConfigService, SortCriteria, SortDirection, SortField, copyToClipboardWithConfirmation, die, exportXlsx, generateRandomString, getYear, isSortFieldString, navigateByUrl, resetSortCriteria } from "@bk/util";
import { Subject } from "rxjs";
import { Params, Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { BaseModel, FieldDescription } from "@bk/models";
import { DataService } from "../data.service";
import { decrementIndex, getIndexByKey, getKeyByIndex, incrementIndex } from "../search.util";
import { filterModelsByCategory, filterModelsBySearchTerm, filterModelsByTag, filterModelsByYear, sortModels } from "./base-model.util";
import { createComment } from "../../comment/comment.util";
import { connect }  from 'ngxtension/connect';
import { AuthorizationService } from "../../authorization/authorization.service";

/**
 * This abstract service contains a declarative state management for all data lists. It reacts to:
 * - a collection of items from the database
 * - a filter (ion-searchbar input): filter
 * - a dropwdown to filter by year: selectedYear
 * - a dropdown to filter by category: selectedCategory
 * - filtering by a tag: selectedTag
 * - a stepper to step through the detail pages: currentIndex/Key, nextIndex/key, previousIndex/key
 * - pagination is partially implemented, but not used yet (currentPage).
 * 
 * The implementation is based on Josh Morony, see 
 * - https://github.com/joshuamorony/signals-rxjs-demo.
 * - https://www.youtube.com/watch?v=44_IcGPKQ_M
 * - https://www.youtube.com/watch?v=R4Ff2bPiWh4&t=0s
 * 
 * It is using Angular signals and rxjs for state management and notification, no other third party libraries are used.
 * Whenever data is changed in the application by an event (e.g. http, database, click event), 
 * its current state is represented by a source, which is a Subject Observable.
 * When a change action occurs, the sources emit the new data.
 * The application state (DataState) is then updated in response to these sources emitting data.
 * Then the rest of the application can react to these state changes using the selectors.
 */

  export interface DataState {
    listType: number,
    groupedItems: BaseModel[],
    filteredItems: BaseModel[],
    searchTerm: string,
    selectedYear: number,
    selectedCategory: number,
    selectedTag: string,
    currentSortCriteria: SortCriteria,
    error: string,
    status: "success" | "error" | "loading",
    currentKey: string
  }

  @Injectable({
    providedIn: 'root'
  })
  export abstract class BaseService {
    protected router = inject(Router);
    protected authorizationService = inject(AuthorizationService);
    protected toastController = inject(ToastController);
    protected dataService = inject(DataService);
    protected configService = inject(ConfigService);

    /*-------------------------- state --------------------------------*/
    protected state: WritableSignal<DataState> = signal(this.getResetState());

    public getResetState(): DataState {
      return {
        listType: 0,
        groupedItems: [],
        filteredItems: [],
        searchTerm: '',
        selectedYear: getYear(),
        selectedCategory: CategoryType.All as number,
        selectedTag: '',
        currentSortCriteria: resetSortCriteria(),
        error: '',
        status: "loading",
        currentKey: ''
      }
    }

    /*-------------------------- selectors --------------------------------*/
    public listType = computed(() => this.state().listType);
    public groupedItems = computed(() => this.state().groupedItems);
    public filteredItems = computed(() => this.state().filteredItems);
    public searchTerm = computed(() => this.state().searchTerm);
    public selectedYear = computed(() => this.state().selectedYear);
    public selectedCategory = computed(() => this.state().selectedCategory);
    public selectedTag = computed(() => this.state().selectedTag);
    public currentSortCriteria = computed(() => this.state().currentSortCriteria);
    public error = computed(() => this.state().error);
    public status = computed(() => this.state().status);
    public currentKey = computed(() => this.state().currentKey);

    // derived from listType
    public title = computed(() => ListTypes[this.listType()].title ?? '');
    public modelType = computed(() => ListTypes[this.listType()].modelType ?? ModelType.Subject);
    public relationshipType = computed(() => ListTypes[this.listType()].relationshipType ?? CategoryType.Undefined);
    public slug = computed(() => ListTypes[this.listType()].slug ?? '');
    public filterType = computed(() => ListTypes[this.listType()].filterType ?? FilterType.None);
    public categoryConfig = computed(() => ListTypes[this.listType()].category);
    public type = computed(() => ListTypes[this.listType()].type ?? CategoryType.Undefined);
    public searchConfig = computed(() => ListTypes[this.listType()].search);
    public yearConfig = computed(() => ListTypes[this.listType()].year);
    public initialQuery = computed(() => ListTypes[this.listType()].initialQuery ?? []);
    public orderBy = computed(() => ListTypes[this.listType()].orderBy ?? 'name');
    public sortOrder = computed(() => ListTypes[this.listType()].sortOrder ?? 'asc');

    // steppers
    public currentIndex = computed(() => getIndexByKey(this.filteredItems(), this.currentKey()));
    public currentItem = computed(() => this.filteredItems()[this.currentIndex()]); // currentIndex must be valid, always returns an item
    public nextIndex = computed(() => incrementIndex(this.currentIndex(), this.filteredItems().length));
    public nextKey = computed(() => getKeyByIndex(this.filteredItems(), this.nextIndex()));

    public previousIndex = computed(() => decrementIndex(this.currentIndex(), this.filteredItems().length));
    public previousKey = computed(() => getKeyByIndex(this.filteredItems(), this.previousIndex()));

    /*-------------------------- sources --------------------------------*/
    public listType$ = new Subject<number>();
    public groupedItems$ = new Subject<BaseModel[]>();
    // filteredItems is always computed, never set directly
    public searchTerm$ = new Subject<string>();
    public selectedYear$ = new Subject<number>;
    public selectedCategory$ = new Subject<number>;
    public selectedTag$ = new Subject<string>;
    public currentSortCriteria$ = new Subject<SortCriteria>;
    public error$ = new Subject<Error>(); 
    public retry$ = new Subject<void>();
    public currentKey$ = new Subject<string | undefined>();

    /*-------------------------- reducers --------------------------------*/
    constructor() {
      connect(this.state)
        // when the listType changes, reset the state and reload the data
         .with(this.listType$, (state, _listType) => ({
          listType: _listType,
          groupedItems: [],
          searchTerm: undefined,
          selectedYear: undefined,
          selectedCategory: undefined,
          selectedTag: undefined,
          currentSortCriteria: resetSortCriteria(),
          error: undefined,
          status: "loading",
          currentKey: undefined
        }))

        // when the data in the database changes or has been reloaded successfully
        .with(this.groupedItems$, (state, _items) => ({ 
          ...state, 
          groupedItems: _items, 
          filteredItems: _items, 
          status: "success" 
        }))

        // filteredItems is always computed, no reducer needed

        // when user inserts a new searchTerm
        .with(this.searchTerm$, (state, _searchTerm) => ({ 
          ...state, 
          searchTerm: _searchTerm === "" ? undefined : _searchTerm, 
          filteredItems: sortModels(filterModelsBySearchTerm(state, _searchTerm), this.currentSortCriteria())
        }))

        // when user selects a new year
        .with(this.selectedYear$, (state, _year) => ({
          ...state,
          selectedYear: _year,
          filteredItems: sortModels(filterModelsByYear(state, _year), this.currentSortCriteria())
        }))

        // when user selects a new category
        .with(this.selectedCategory$, (state, _cat) => ({ 
          ...state, 
          selectedCategory: _cat,
          filteredItems: sortModels(filterModelsByCategory(state, _cat), this.currentSortCriteria())
        }))

        // when user selects a new tag
        .with(this.selectedTag$, (state, _tag) => ({ 
          ...state, 
          selectedTag: _tag, 
          filteredItems: sortModels(filterModelsByTag(state, _tag), this.currentSortCriteria())
        }))

        // when user changes the sort criteria
        .with(this.currentSortCriteria$, (state, _sortCriteria) => ({ 
          ...state, 
          currentSortCriteria: _sortCriteria,
          filteredItems: sortModels(state.filteredItems, _sortCriteria)
        }))

        // when a db query returns with an error
        .with(this.error$, (state, _error) => ({ 
          ...state, 
          error: _error.message, 
          status: "error" 
        }))

        // when the system is trying to reload the data
        .with(this.retry$, (state) => ({ 
          ...state, 
          status: "loading" 
        }))

        // when user or system selects a new current item (for stepper in detail view)
        .with(this.currentKey$, (state, _currentKey) => ({ 
          ...state, 
          currentKey: _currentKey, 
          status: "loading" 
        }))
  }

  /*-------------------------- searching --------------------------------*/
  public onSearchtermChange($event: Event): void {
    const _searchTerm = ($event.target as HTMLInputElement).value as unknown as string;
    this.searchTerm$.next(_searchTerm);
  }

  /*-------------------------- sorting --------------------------------*/
  public sort(sortField: SortField): void {
    // if sortCriteria changed, reset the sort direction to ascending
    // we assume that the data is initially read in ascending order; that's why we set the initial sort direction to descending
    // this assumption is not always true, but we tolerate an initial descending sort direction for other cases as well
    const _newSortDirection = this.currentSortCriteria().direction === SortDirection.Undefined ? SortDirection.Descending : this.currentSortCriteria().direction * -1;
    this.currentSortCriteria$.next({ direction: _newSortDirection, field: sortField, typeIsString: isSortFieldString(sortField) });
  }

  /*-------------------------- exports --------------------------------*/
  public async export2excel(tableName: string, tableDescription: FieldDescription[]): Promise<void> {
    exportXlsx(convertToTable(this.filteredItems(), tableDescription), this.getFileName(), tableName);
  }

  private getFileName(): string {
    return generateRandomString(10) + '.' + EXPORT_FORMATS[ExportFormat.XLSX].abbreviation;
  }

  /*-------------------------- comments --------------------------------*/
  public async saveComment(collectionName: string, parentKey: string | undefined, comment: string): Promise<void> {
    const _user = this.authorizationService.currentUser() ?? die('BaseService.saveComment: inconsistent app state: there is no current user.');
    const _key = _user.bkey ?? die('BaseService.saveComment: inconsistent app state: current user has no key.');
    if (!parentKey) die('BaseService.saveComment: inconsistent app state: there is no parentKey.');
    const _comment = createComment(_key, _user.personName, comment, collectionName, parentKey);
    await this.dataService.createModel(`${collectionName}/${parentKey}/${CollectionNames.Comment}`, _comment);
  }

  /*-------------------------- search index --------------------------------*/
  public abstract getSearchIndex(item: BaseModel): string;
  public abstract getSearchIndexInfo(): string;

  /*-------------------------- navigate --------------------------------*/
  public async navigateToUrl(url: string | undefined, queryParams?: Params): Promise<void> {
    navigateByUrl(this.router, url, queryParams);
  }

  /*-------------------------- other --------------------------------*/
  public async copy(data: string | number, confirmation?: string): Promise<void> {
    await copyToClipboardWithConfirmation(this.toastController, this.configService.getConfigNumber('settings_toast_length'), data, confirmation);
  }

}

