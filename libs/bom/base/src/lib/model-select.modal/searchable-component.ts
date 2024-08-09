import { WritableSignal, computed, signal } from '@angular/core';
import { BaseModel } from '@bk/models';
import { CategoryType, FilterType, ListTypes, ModelType } from '@bk/categories';
import { Subject } from 'rxjs';
import { sortModels } from '../models/base-model/base-model.util';
import { connect }  from 'ngxtension/connect';
import { SortCriteria, SortDirection, SortField, getProperty, isSortFieldString, nameMatches, resetSortCriteria } from '@bk/util';

interface SimpleDataState {
  listType: number;
  groupedItems: BaseModel[],
  filteredItems: BaseModel[],
  searchTerm: string,
  currentSortCriteria: SortCriteria,
}

export abstract class SearchableComponent {

  /*-------------------------- state --------------------------------*/
  protected state: WritableSignal<SimpleDataState> = signal(this.getResetState());

  public getResetState(): SimpleDataState {
    return {
      listType: 0,
      groupedItems: [],
      filteredItems: [],
      searchTerm: '',
      currentSortCriteria: resetSortCriteria(),
    }
  }

  public resetState(): void {
    this.state.set(this.getResetState());
  }
  
  /*-------------------------- selectors --------------------------------*/
  public listType = computed(() => this.state().listType);
  public groupedItems = computed(() => this.state().groupedItems);
  public filteredItems = computed(() => this.state().filteredItems);
  public searchTerm = computed(() => this.state().searchTerm);
  public currentSortCriteria = computed(() => this.state().currentSortCriteria);

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

  /*-------------------------- sources --------------------------------*/
  public listType$ = new Subject<number | undefined>();
  public groupedItems$ = new Subject<BaseModel[]>();
  // filteredItems is always computed, never set directly
  public searchTerm$ = new Subject<string>();
  public currentSortCriteria$ = new Subject<SortCriteria>;

  /*-------------------------- reducers --------------------------------*/
  constructor() {
    connect(this.state)
      // when the listType changes, reset the state and reload the data
        .with(this.listType$, (state, _listType) => ({
        state: this.getResetState(),
        listType: _listType,
      }))

      // when the data in the database changes or has been reloaded successfully
      .with(this.groupedItems$, (state, _items) => ({ 
        ...state, 
        groupedItems: _items, 
        filteredItems: _items 
      }))

      // filteredItems is always computed, no reducer needed

      // when user inserts a new searchTerm
      .with(this.searchTerm$, (state, _searchTerm) => ({ 
        ...state, 
        searchTerm: _searchTerm === "" ? undefined : _searchTerm, 
        filteredItems: sortModels(this.filterModelsBySearchTerm(_searchTerm), this.currentSortCriteria())
      }))
  }

  /*-------------------------- searching --------------------------------*/
  public onSearchtermChange($event: Event): void {
    const _searchTerm = ($event.target as HTMLInputElement).value as unknown as string;
    this.searchTerm$.next(_searchTerm);
  }

  private filterModelsBySearchTerm(_searchTerm: string): BaseModel[] {
    return this.groupedItems().filter(
      (_model) => {
        const _searchFieldName = ListTypes[this.listType()].search?.fieldName;
        return (
          nameMatches(getProperty(_model, _searchFieldName as keyof BaseModel) + '', _searchTerm)
        )
      });
  }

  /*-------------------------- sorting --------------------------------*/
  public sort(sortField: SortField): void {
    // if sortCriteria changed, reset the sort direction to ascending
    // we assume that the data is initially read in ascending order; that's why we set the initial sort direction to descending
    // this assumption is not always true, but we tolerate an initial descending sort direction for other cases as well
    const _newSortDirection = this.currentSortCriteria().direction === SortDirection.Undefined ? SortDirection.Descending : this.currentSortCriteria().direction * -1;
    this.currentSortCriteria$.next({ direction: _newSortDirection, field: sortField, typeIsString: isSortFieldString(sortField) });
  }
}



