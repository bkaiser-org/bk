import { DestroyRef, Component, inject } from "@angular/core";
import { AuthorizationService } from "../../authorization/authorization.service";
import { BaseService } from "./base-model.service";
import { Category, CategoryType, FilterType, ListType, ListTypes, ModelType, getModelSlug } from "@bk/categories";
import { AppNavigationService, ENV, NameDisplay, SortDirection, SortField, copyToClipboardWithConfirmation, getYear } from "@bk/util";
import { DataService } from "../data.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Subscription } from "rxjs";
import { ToastController } from "@ionic/angular";

@Component({
  selector: 'bk-base-model-list',
  template: '',
})
export abstract class BaseModelListComponent {
  public authorizationService = inject(AuthorizationService);
  protected dataService = inject(DataService);
  protected destroyRef = inject(DestroyRef); // takeUntilDestroyed must be used inside an injection context.
  protected appNavigationService = inject(AppNavigationService);
  protected env = inject(ENV);
  protected toastController = inject(ToastController);

  protected abstract baseService: BaseService;
  protected routeParamSubscription: Subscription | undefined;

  public CT = CategoryType;
  public LT = ListType;
  public SF = SortField;
  public SD = SortDirection;
  public MT = ModelType;
  public ND = NameDisplay;

  protected abstract listType: ListType;
  protected abstract collectionName: string;
  protected abstract listRoute: string;

  protected prepareData(listType: ListType) {
    this.baseService.listType$.next(listType);
    this.dataService.searchData(
        this.collectionName, 
        ListTypes[listType].initialQuery ?? [],
        ListTypes[listType].orderBy ?? 'name',
        ListTypes[listType].sortOrder ?? 'asc'
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((_data) => {
        this.baseService.groupedItems$.next(_data);
        if (ListTypes[listType].filterType === FilterType.Year) {
          this.baseService.selectedYear$.next(getYear());
        }      
      });
  }

  public onTagSelected(tag: string) {
    this.baseService.selectedTag$.next(tag);
  }

  public onCategoryChange($event: Event): void {
    const _category = ($event.target as HTMLInputElement).value as unknown as Category;
    this.baseService.selectedCategory$.next(_category.id);
  }

  public onYearChange($event: Event): void {
    const _year = Number(($event.target as HTMLInputElement).value);
    this.baseService.selectedYear$.next(_year)
  }

  public async add(): Promise<void> {
    this.appNavigationService.pushLink(this.listRoute);
    await this.baseService.navigateToUrl(`/${ListTypes[this.listType].slug}/new`);
  }

  public async edit(key: string, modelType?: ModelType): Promise<void> {
    this.appNavigationService.pushLink(this.listRoute);
    const _slug = modelType === undefined ? ListTypes[this.listType].slug : getModelSlug(modelType);
    await this.baseService.navigateToUrl(`/${_slug}/${key}`);
  }

  public async copy(data: string | number, confirmation?: string): Promise<void> {
    await copyToClipboardWithConfirmation(this.toastController, this.env.settingsDefaults.toastLength, data, confirmation);
  }
}