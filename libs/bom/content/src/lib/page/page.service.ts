import { Injectable, inject } from "@angular/core";
import { ListType, SectionTypes, getModelSlug } from "@bk/categories";
import { Observable } from "rxjs";
import { CollectionNames, die } from "@bk/util";
import { BaseService, BkModelSelectComponent } from "@bk/base";
import { PageModel, isSection } from "@bk/models";
import { ModalController } from "@ionic/angular/standalone";
import { BkCardSelectModalComponent } from "@bk/ui";
import { createSection } from "../section/section.util";
import { SectionService } from "../section/section.service";

@Injectable({
    providedIn: 'root'
})
export class PageService extends BaseService {
  protected modalController = inject(ModalController);
  private sectionService = inject(SectionService);

  /*-------------------------- CRUD operations --------------------------------*/
  /**
   * Create a new page in the database.
   * @param page the PageModel to store in the database
   * @returns the document id of the newly created page
   */
  public async createPage(page: PageModel): Promise<string> {
    const _key = await this.dataService.createModel(CollectionNames.Page, page, '@content.page.operation.create');
    await this.saveComment(CollectionNames.Page, _key, '@comment.operation.initial.conf');
    return _key;
  }

  /**
   * Lookup a page in the database by its document id and return it as an Observable.
   * @param key the document id of the page
   * @returns an Observable of the PageModel
   */
  public readPage(key: string | undefined): Observable<PageModel | undefined> {
    this.currentKey$.next(key);
    return this.dataService.readModel(CollectionNames.Page, key) as Observable<PageModel>;
  }

  /**
   * Update a page in the database with new values.
   * @param page the PageModel with the new values. Its key must be valid (in order to find it in the database)
   */
  public async updatePage(page: PageModel): Promise<void> {
    if (!page?.bkey?.length) die('PageService.updatePage: bkey is mandatory.' );
      // we do not keep an index as we do not show a list of pages
    await this.dataService.updateModel(CollectionNames.Page, page, `@content.${getModelSlug(page.modelType)}.operation.update`);
  }

  /**
   * Delete a page.
   * We are not actually deleting a page. We are just archiving it.
   * @param key 
   */
  public async deletePage(page: PageModel) {
    page.isArchived = true;
    await this.updatePage(page);
  }

  public listAllPages(): Observable<PageModel[]> {
    return this.dataService.listAllModels(CollectionNames.Page) as Observable<PageModel[]>;
  }

  /**
   * 
   * @param page 
   * @param sectionId 
   */
  public async deleteSectionFromPage(page: PageModel, sectionId: string): Promise<void> {
    page.sections.splice(page.sections.indexOf(sectionId), 1);
    await this.updatePage(page);
  }

  /*-------------------------- section handling --------------------------------*/
  public async addSection(page: PageModel): Promise<void> {
    const _modal = await this.modalController.create({
      component: BkCardSelectModalComponent,
      cssClass: 'full-modal',
      componentProps: {
        categories: SectionTypes,
        slug: 'section'
      }
    });
    _modal.present();
    const { data, role } = await _modal.onWillDismiss();
    if (role === 'confirm') { // data = selected Category
      const _section = createSection(data, this.configService.getConfigString('tenant_id'));
      const _sectionKey = await this.sectionService.createSection(_section);
      if (_sectionKey) {
        page.sections.push(_sectionKey);
        await this.updatePage(page);
      } 
    }
  }

  public async selectSection(page: PageModel): Promise<void> {
    const _modal = await this.modalController.create({
      component: BkModelSelectComponent,
      cssClass: 'full-modal',
      componentProps: {
        bkListType: ListType.SectionAll
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      if (isSection(data)) {
        const _sectionKey = data.bkey;
        if (_sectionKey) {
          page.sections.push(_sectionKey);
          await this.updatePage(page);
        } 
      } 
    }
    return undefined;
  }

    /*-------------------------- search index --------------------------------*/
    public getSearchIndex(page: PageModel): string {
      return 'n:' + page.name;
    }
  
    public getSearchIndexInfo(): string {
      return 'n:ame';
    }
}