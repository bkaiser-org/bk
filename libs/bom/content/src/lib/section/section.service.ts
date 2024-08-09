import { Injectable, inject } from "@angular/core";
import { Observable, firstValueFrom } from "rxjs";
import { CollectionNames, error, getImgixUrlWithAutoParams } from "@bk/util";
import { BaseService } from "@bk/base";
import { BaseModel, Image, SectionModel, isSection } from "@bk/models";
import { SectionTypes, getCategoryName } from "@bk/categories";
import { ModalController } from "@ionic/angular/standalone";
import { ImageEditModalComponent } from "./forms/image-edit.modal";

@Injectable({
    providedIn: 'root'
})
export class SectionService extends BaseService {
  private modalController = inject(ModalController);

  /*-------------------------- CRUD operations --------------------------------*/
  /**
   * Save a new SectionModel to the database.
   * @param section the new SectionModel
   * @returns the key of the newly created SectionModel
   */
  public async createSection(section: SectionModel): Promise<string> {
    let _sectionKey = '';
    if (section) {
      section.index = this.getSearchIndex(section);
      _sectionKey = await this.dataService.createModel(CollectionNames.Section, section, '@content.section.operation.create');
      await this.saveComment(CollectionNames.Section, _sectionKey, '@comment.operation.initial.conf');
    }
    return Promise.resolve(_sectionKey);
  }

  /**
   * Return an Observable of a section by uid.
   * @param afs a handle on the Firestore database
   * @param uid the key of the model document
   */
  public readSection(key: string): Observable<SectionModel> {
    this.currentKey$.next(key);
    return this.dataService.readModel(CollectionNames.Section, key) as Observable<SectionModel>;
  }

  /**
   * Update an existing SectionModel with new values.
   * @param firestore a handle on the Firestore database
   * @param section the SectionModel with the new values
   * @param toastController 
   */
  public async updateSection(section: SectionModel): Promise<void> {
    section.index = this.getSearchIndex(section);
    await this.dataService.updateModel(CollectionNames.Section, section, '@content.section.operation.update');
  }

  /**
   * Delete a section by setting its isArchived flag to true.
   * To physically delete a section, an admin user needs to delete it directly in the database.
   * @param section the section to be deleted
   */
  public async deleteSection(section: SectionModel): Promise<void> {
    section.isArchived = true;
    await this.dataService.updateModel(CollectionNames.Section, section, '@content.section.operation.delete');
  }

  /*-------------------------- DOWNDLOAD_URL --------------------------------*/
  public async updateDownloadUrl(sectionKey: string, fullPath: string | undefined): Promise<void> {
    if (fullPath) {
      const _section = await firstValueFrom(this.readSection(sectionKey));
      try {
        // different params whether image or pdf
        _section.url = getImgixUrlWithAutoParams(fullPath);
        await this.updateSection(_section);  
      }
      catch (_ex) {
        error(undefined, 'SectionService.updateDownloadUrl -> ERROR: ' + JSON.stringify(_ex));
      }
    }
  }

  /*-------------------------- SEARCH --------------------------------*/
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getSearchIndex(item: BaseModel): string {
    if (isSection(item)) {
      return 'n:' + item.name + ' cn:' + getCategoryName(SectionTypes, item.category);
    }
    return '';
  }

  public getSearchIndexInfo(): string {
    return 'n:ame cn:categoryName';
  }

  /*-------------------------- MODALS --------------------------------*/
  public async editImage(imageDesc: Image): Promise<Image | undefined> {
    const _modal = await this.modalController.create({
      component: ImageEditModalComponent,
      cssClass: 'wide-modal',
      componentProps: {
        imageDesc: imageDesc
      }
    });
    _modal.present();

    const { data, role } = await _modal.onWillDismiss();
    if(role === 'confirm') {
      return data as Image;
    }
    return undefined;
  }

}

