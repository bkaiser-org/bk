import { Injectable } from '@angular/core';
import { createFavoriteEmailAddress, createFavoritePhoneAddress, createFavoritePostalAddress, getAddressIndex } from '@bk/address';
import { BaseService, checkKey } from '@bk/base';
import { AddressUsage, getCollectionNameFromRelationshipType, getModelSlug } from '@bk/categories';
import { CollectionNames, die, warn } from '@bk/util';
import { asapScheduler, firstValueFrom, map, Observable } from 'rxjs';
import { RelationshipModel, SubjectModel, AddressModel, MemberInfo, BaseModel } from '@bk/models';
import { newMembershipFromSubject } from '@bk/membership';
import { getSubjectIndex, getSubjectIndexInfo } from './subject.util';

@Injectable({
  providedIn: 'root'
})
export class SubjectService extends BaseService {

  /*-------------------------- CRUD operations --------------------------------*/
  public async createSubject(subject: SubjectModel | undefined, memberInfo?: MemberInfo): Promise<void> {
    if (subject) {
      subject.index = getSubjectIndex(subject);
      const _subjectKey = await this.dataService.createModel(CollectionNames.Subject, subject, `@subject.${getModelSlug(subject.modelType)}.operation.create`);

      if (_subjectKey) {
        subject = checkKey(subject, _subjectKey) as SubjectModel; // make sure the key is set
        if (memberInfo) {
          await this.addMembership(subject, memberInfo, '@comment.operation.initial.conf');
        }
        await this.addAddressessFromFavorites(subject);
        if (subject.bkey) {
          await this.saveComment(CollectionNames.Subject, subject.bkey, '@comment.operation.initial.conf');
        }
      }
    }
  }
  
  public readSubject(key: string): Observable<SubjectModel | undefined> {
    asapScheduler.schedule(() => this.currentKey$.next(key));
    return this.dataService.readModel(CollectionNames.Subject, key) as Observable<SubjectModel>;
  }

  public readSubjectByBexioId(bexioId: string): Observable<SubjectModel | undefined> {
    return this.dataService.listModelsBySingleQuery(CollectionNames.Subject, 'bexioId', bexioId).pipe(
      map((subjects: BaseModel[]) => {
        if (subjects.length === 1) {
          this.currentKey$.next(subjects[0].bkey);
          return subjects[0] as SubjectModel;
        } else {
          return undefined;
        }
      })
    );
  }

  public async updateSubject(subject: SubjectModel): Promise<void> {
    subject.index = getSubjectIndex(subject);
    await this.dataService.updateModel(CollectionNames.Subject, subject, `@subject.${getModelSlug(subject.modelType)}.operation.update`);
  }

  public async deleteSubject(subject: SubjectModel): Promise<void> {
    subject.isArchived = true;
    await this.dataService.updateModel(CollectionNames.Subject, subject, `@subject.${getModelSlug(subject.modelType)}.operation.update`);
  }

  /*-------------------------- memberships --------------------------------*/
  private async addMembership(subject: SubjectModel, memberInfo: MemberInfo, comment: string): Promise<void> {
    const _membership = await this.createMembership(subject, memberInfo);
    if (_membership) {
      await this.dataService.createModel(CollectionNames.Membership, _membership, '@membership.operation.create');
      if (_membership.bkey) {
        await this.saveComment(getCollectionNameFromRelationshipType(_membership.category), _membership.bkey, comment);
      }
    }  
  }

  /**
   * Create a new membership based on information in a subject and memberinfo
   * @param subject 
   * @param memberInfo 
   * @returns 
   */
  private async createMembership(subject: SubjectModel, memberInfo: MemberInfo): Promise<RelationshipModel | null> {
    if (memberInfo?.orgId === undefined) {
      warn('SubjectService.createMembership() -> orgId is mandatory.');
      return null;
    }
    const _org = await firstValueFrom(this.dataService.readModel(CollectionNames.Subject, memberInfo.orgId)) as SubjectModel;
    if (!_org) {
      warn('SubjectService.createMembership(' + memberInfo.orgId + ') -> org not found.');
      return null;
    }
    return newMembershipFromSubject(subject, _org, memberInfo.dateOfEntry, memberInfo.memberCategory, memberInfo.function, memberInfo.abbreviation, memberInfo.nickName);
  }

  /*-------------------------- addresses --------------------------------*/
    /**
   * Create and save a new address under a given parent model into the database.
   * @param parentKey  the key of the parent model (typically a subject)
   * @param address the address to store in the database
   */
  public async saveNewAddress(parentKey: string, address: AddressModel): Promise<void> {
    if (parentKey?.length === 0) die('SubjectService.saveNewAddress: parentKey is mandatory');
    address.index = getAddressIndex(address);
    await this.dataService.createModel(`${CollectionNames.Subject}/${parentKey}/${CollectionNames.Address}`, address, '@subject.address.operation.create');
  }

  /**
   * Use the cached address information in a given SubjectModel (fields fav_*) to create the favorite addresses.
   * This is typically done, when a user is added with a new membership form (that contains fields for subject and address).
   * @param subject the source subject
   */
  public async addAddressessFromFavorites(subject: SubjectModel): Promise<void> {
    if (!subject.bkey) die('SubjectService.addAddressessFromFavorites: subject must have a key.');
    if (subject.fav_city) {
      await this.saveNewAddress(subject.bkey, createFavoritePostalAddress(AddressUsage.Home, subject.fav_street, subject.fav_zip, subject.fav_city));
    }
    if (subject.fav_phone) {
      await this.saveNewAddress(subject.bkey, createFavoritePhoneAddress(AddressUsage.Home, subject.fav_phone));
    }
    if (subject.fav_email) {
      await this.saveNewAddress(subject.bkey, createFavoriteEmailAddress(AddressUsage.Home, subject.fav_email));
    }
  }

  /*-------------------------- search index --------------------------------*/
  public getSearchIndex(item: BaseModel): string {
    return getSubjectIndex(item);
  }

  public getSearchIndexInfo(): string {
    return getSubjectIndexInfo();
  }
}
