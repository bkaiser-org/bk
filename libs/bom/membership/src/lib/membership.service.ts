/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable, inject } from '@angular/core';
import { BaseService, BkModelSelectComponent } from '@bk/base';
import { getMembershipPrice, getRelationshipIndex, getRelationshipIndexInfo } from '@bk/relationship';
import { CategoryConfig, ListType, MemberType, MemberTypes, MembershipState, ModelType, OrgKey, ScsMemberType, ScsMemberTypes, getCategoryAbbreviation, getMembershipState } from '@bk/categories';
import { EXPORT_FORMATS, ExportFormat } from '@bk/core';
import { CollectionNames, DateFormat, END_FUTURE_DATE_STR, addDuration, bkTranslate, convertDateFormatToString, die, exportXlsx, generateRandomString, getEndOfYear, getExportFileName, getStartOfYear, getTodayStr, warn } from '@bk/util';
import { Observable, combineLatest, firstValueFrom, map, of } from 'rxjs';
import { BaseModel, MembershipSubjectModel, RelationshipModel, SubjectModel, isMembership, isOrg, isSubject } from '@bk/models';
import { convertToSrvDataRow, getMembershipCategoryChangeComment, getRelLogEntry, getSrvHeaderRow, newMembershipFromSubject } from './membership.util';
import { MembershipEditModalComponent } from './membership-edit.modal';
import { BkCategorySelectModalComponent, BkDateSelectModalComponent, BkLabelSelectModalComponent, MembershipCategoryChangeModalComponent } from '@bk/ui';
import { ModalController } from '@ionic/angular/standalone';
  
  @Injectable({
    providedIn: 'root'
  })
  export class MembershipService extends BaseService {
    private modalController = inject(ModalController);

  /*------------------------------ membership CRUD ---------------------------------------*/
    /**
   * Create a new RelationshipModel and save it to the database.
   * @param ownership the new RelationshipModel
   * @returns the document id of the stored model in the database
   */
  public async saveNewRelationship(membership: RelationshipModel): Promise<string> {
    return await this.dataService.createModel(CollectionNames.Membership, membership, '@membership.operation.create');
  }

  /**
   * Show a modal to edit an existing membership.
   * @param membership the membership to edit
   */
  public async editMembership(membership: RelationshipModel): Promise<void> {
    const _modal = await this.modalController.create({
      component: MembershipEditModalComponent,
      componentProps: {
        membership: membership
      }
    });
    _modal.present();
    await _modal.onWillDismiss();
    // we do not need to handle the data, as the modal component will update the membership directly
  }  
    
  /**
   * Retrieve an existing membership from the database.
   * @param key the key of the membership to retrieve
   * @returns the membership as an Observable
   */
  public readMembership(key: string): Observable<RelationshipModel> {
    this.currentKey$.next(key);
    return this.dataService.readModel(CollectionNames.Membership, key) as Observable<RelationshipModel>;
  }

  /**
   * Update an existing membership with new values.
   * @param membership the membership to update
   */
  public async updateMembership(membership: RelationshipModel): Promise<void> {
    if (membership.validTo?.length === 0) {
      membership.validTo = END_FUTURE_DATE_STR;
    }
    await this.dataService.updateModel(CollectionNames.Membership, membership, `@membership.operation.update`);

  }

  /**
   * Ask user for the end date of an existing membership and end it.
   * We do not archive memberships as we want to make them visible for entries & exits.
   * Therefore, we end an membership by setting its validTo date.
   * @param membership the membership to delete
   */
  public async endMembership(membership: RelationshipModel): Promise<void> {    
    const _date = await this.selectDate();
    if (!_date) return;
    this.endMembershipByDate(membership, convertDateFormatToString(_date, DateFormat.IsoDate, DateFormat.StoreDate, false));
  }

  /**
   * End an existing membership by setting its validTo date.
   * @param membership the membership to end
   * @param dateOfExit the end date of the membership
   */
  public async endMembershipByDate(membership: RelationshipModel, dateOfExit: string): Promise<void> {
    if (membership.validTo.startsWith('9999') && dateOfExit && dateOfExit.length === 8) {
      membership.validTo = dateOfExit;
      membership.relIsLast = true;
      await this.updateMembership(membership);
      await this.saveComment(CollectionNames.Membership, membership.bkey, '@comment.message.membership.deleted');
    }
  }

  /*------------------------------ members ----------------------------------------------*/
  /**
   * Adds a new member to the given organization.
   * @param org the organization to add a member to
   */
   public async addPersonAsMember(org: BaseModel | undefined): Promise<void> {
    if (isOrg(org)) {
      const _person = await this.selectPerson();
      if (!_person) return;
      const _date = await this.selectDate();
      if (!_date) return;
      const _validFrom = convertDateFormatToString(_date, DateFormat.IsoDate, DateFormat.StoreDate);
      const _membership = newMembershipFromSubject(_person, org, _validFrom);
      _membership.index = getRelationshipIndex(_membership);
      await this.saveNewRelationship(_membership);
      await this.saveComment(CollectionNames.Membership, _membership.bkey, '@comment.operation.initial.conf');   
    } else {
      warn('MembershipService.addMember: organization with a valid key is mandatory.');
    }
  } 

  public async createNewMembership(subjectKey: string): Promise<void> {
    const _subject = await firstValueFrom(this.dataService.readModel(CollectionNames.Subject, subjectKey));
    if (isSubject(_subject)) {
      const _org = await this.selectSelectableOrg();
      if (!_org) return;

      const _date = await this.selectDate() ?? getTodayStr(DateFormat.StoreDate);
      if (!_date) return;
      const _validFrom = convertDateFormatToString(_date, DateFormat.IsoDate, DateFormat.StoreDate);

      const _membershipType = await this.selectMembershipType(_org.bkey === OrgKey.SCS);
      if (_membershipType === undefined) return;

      const _membership = newMembershipFromSubject(_subject, _org, _validFrom, _membershipType);
      const _key = await this.saveNewRelationship(_membership);
      await this.saveComment(CollectionNames.Membership, _key, '@comment.operation.initial.conf');   
    } else {
      warn('MembershipService.createNewMembership: no subject ${_subjectKey} found.');
    } 
  }

  public async selectDate(): Promise<string | undefined> {
    const _modal = await this.modalController.create({
      component: BkDateSelectModalComponent,
      cssClass: 'date-modal',
      componentProps: {
        isoDate: getTodayStr(DateFormat.IsoDate)
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      if (typeof(data) === 'string') {
        return data;
      } else {
        warn('MembershipService.selectDate: type of returned data is not string: ' + data);
      }
    }
    return undefined;
  }

  public async selectSelectableOrg(): Promise<SubjectModel | undefined> {
    const _modal = await this.modalController.create({
      component: BkModelSelectComponent,
      componentProps: {
        bkListType: ListType.OrgSelectable
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      return isOrg(data) ? data : undefined;
    }
    return undefined;
  }

  public async selectPerson(): Promise<SubjectModel | undefined> {
    const _modal = await this.modalController.create({
      component: BkModelSelectComponent,
      componentProps: {
        bkListType: ListType.PersonAll
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      return isOrg(data) ? data : undefined;
    }
    return undefined;
  }

  public async selectMembershipType(isScs: boolean): Promise<number | undefined> {
    const _config: CategoryConfig = isScs ? {
      label: '@categories.listType.member.scs.all.categoryLabel',
      categories: ScsMemberTypes,
      selectedCategoryId: ScsMemberType.A1
    } : {
      label: '@categories.listType.member.srv.all.categoryLabel',
      categories: MemberTypes,
      selectedCategoryId: MemberType.Active
    }
    const _modal = await this.modalController.create({
      component: BkCategorySelectModalComponent,
      componentProps: {
        config: _config
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      if (data !== undefined) {
        return parseInt(data);
      }
    }
    return undefined;
  }

  public async changeMembershipCategory(oldMembership: RelationshipModel): Promise<void> {
    const _modal = await this.modalController.create({
      component: MembershipCategoryChangeModalComponent,
      componentProps: {
        membership: oldMembership
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm' && data !== undefined) {   // result is membershipType + '.' + validFrom, e.g. 7.20240309
      const _parts = data.split('.');
      if (_parts.length === 2) {
        await this.saveMembershipCategoryChange(oldMembership, parseInt(_parts[0]), _parts[1]);
      } 
    }
  }

  /**
   * Conclude a membership category change by ending the existing membership and creating a new one with the new category.
   * The existing membership is ended one day before the given newValidFrom.
   * The new membership starts on the given newValidFrom.
   * @param oldMembership the existing membership that is ended
   * @param newMembershipType the new membership type
   * @param newValidFrom the date of the category change in StoreDate format
   */
  public async saveMembershipCategoryChange(oldMembership: RelationshipModel, newMembershipType: number, newValidFrom: string): Promise<void> {
    if (typeof(newMembershipType) !== 'number') die('MembershipService.saveMembershipCategoryChange: newMembershipType must be of type number.');
    oldMembership.relIsLast = false;
    oldMembership.validTo = addDuration(newValidFrom, { days: -1});
    await this.updateMembership(oldMembership);

    // add a comment about the category change to the current membership
    const _comment = getMembershipCategoryChangeComment(oldMembership.objectKey, oldMembership.subType, newMembershipType);
    this.saveComment(CollectionNames.Membership, oldMembership.bkey, _comment);
    
    // create a new membership with the new type and the start date
    const _newMembership = this.copyMembershipWithNewType(oldMembership, newMembershipType, newValidFrom);
    const _key = await this.saveNewRelationship(_newMembership);

    // add a comment about the category change to the new membership
    this.saveComment(CollectionNames.Membership, _key, _comment);   
  }

  /**
   * Clone a membership with a new type and apply the changes needed for a category change. 
   * It is used for membership category changes, where we end the existing membership and create a new one with the new type.
   * @param oldMembership the existing membership that is cloned into a new one
   * @param newMembershipType the new membership type
   * @returns the copied membership
   */
  public copyMembershipWithNewType(oldMembership: RelationshipModel, newMembershipType: number, newValidFrom: string): RelationshipModel {
    const _newMembership = structuredClone(oldMembership);
    _newMembership.bkey = '';
    _newMembership.subType = newMembershipType;
    _newMembership.price = getMembershipPrice(_newMembership.objectKey, _newMembership.subType);
    _newMembership.state = getMembershipState(_newMembership.objectKey, _newMembership.subType);
    _newMembership.validFrom = newValidFrom;
    _newMembership.validTo = END_FUTURE_DATE_STR;
    _newMembership.index = getRelationshipIndex(_newMembership);
    _newMembership.priority = oldMembership.priority + 1;
    _newMembership.relIsLast = true;
    _newMembership.relLog = getRelLogEntry(oldMembership.objectKey, _newMembership.priority, oldMembership.relLog, newValidFrom, newMembershipType);    
    return _newMembership;
  }

  /**
   * Clone a membership with a new type and apply the changes needed for a category change. 
   * It is used for membership category changes, where we end the existing membership and create a new one with the new type.
   * @param oldMembership the existing membership that is cloned into a new one
   * @param newMembershipType the new membership type
   * @returns the copied membership
   */
  public joinMembershipWithSubject(membership: RelationshipModel, subject: SubjectModel): MembershipSubjectModel {
    const _membershipSubject = structuredClone(membership) as MembershipSubjectModel;
    _membershipSubject.modelType = ModelType.MembershipSubject;
    _membershipSubject.subjectDateOfBirth = subject.dateOfBirth;
    _membershipSubject.subjectDateOfDeath = subject.dateOfDeath;
    _membershipSubject.subjectPhone = subject.fav_phone;
    _membershipSubject.subjectEmail = subject.fav_email;
    _membershipSubject.subjectStreet = subject.fav_street;
    _membershipSubject.subjectZipCode = subject.fav_zip;
    _membershipSubject.subjectCity = subject.fav_city;
    return _membershipSubject;
  }

  /**
   * Return an Observable of a Relationship by uid.
   * @param key the key of the model document
   */
  public readRelationship(key: string): Observable<RelationshipModel> {
    if (!key || key.length === 0) die('RelationshipModelUtil.readRelationship: key is mandatory');
    return this.dataService.readModel(CollectionNames.Relationship, key) as Observable<RelationshipModel>;
  }

  /**
   * Edit an existing member. The member is the subject of the relationship, ie. a person, organisation or group.
   * @param member the member to edit
   */
  public async editMember(membership: RelationshipModel): Promise<void> {
    const _slug = membership.subjectType === ModelType.Org ? 'org' : 'person';
    await this.navigateToUrl(`/${_slug}/${membership.subjectKey}`);
  }

  /*-------------------------- list --------------------------------*/
  /**
   * List the members of an organization.
   * @param orgKey the document id of the organization (subject) to list its members for
   * @returns an Observable array of the organization's memberships
   */
  public listMembersOfOrg(orgKey: string): Observable<RelationshipModel[]> {
    if (!orgKey || orgKey.length === 0) return of([]);
    return this.dataService.listModelsBySingleQuery(CollectionNames.Membership, 'objectKey', orgKey) as Observable<RelationshipModel[]>;
  }

  /**
   * List the memberships of a give subject.
   * @param subjectKey the given subject to list its memberships for.
   * @returns a list of the subject's memberships as an Observable
   */
  public listMembershipsOfSubject(subjectKey: string): Observable<RelationshipModel[]> {
    if (!subjectKey || subjectKey.length === 0) return of([]);
    return this.dataService.listModelsBySingleQuery(CollectionNames.Membership, 'subjectKey', subjectKey) as Observable<RelationshipModel[]>;
  }

  /*------------------------------ copy email addresses ------------------------------*/
    public getAllEmailAddresses(): Observable<string[]> {
      const _selectedMemberships$ = of(this.filteredItems());
      const _subjects$ = this.dataService.listAllModels(CollectionNames.Subject);

      // join the two streams to retrieve the email addresses of the selected memberships
      const _emails$ = combineLatest([_selectedMemberships$, _subjects$]).pipe(
        map(([_memberships,_subjects]) =>_memberships.map(_membership=> {
              if (isMembership(_membership)) {
                const _subject = _subjects.find(a => a.bkey === _membership.subjectKey);
                if (isSubject(_subject)) {
                  return _subject.fav_email;
                } else {
                  die('MembershipService.getAllEmailAddresses: it should be a subject.')
                }
              } else {
                die('MembershipService.getAllEmailAddresses: it should be a membership.');
              }
        })));
      return _emails$.pipe(map(_emails => _emails.filter(_email => _email !== '')));
    }

  // tbd: should we show a modal with all email addresses as deletable ion-chips ?
  public async copyAllEmailAddresses(): Promise<void> {
    const _emails = await firstValueFrom(this.getAllEmailAddresses());
    await this.copy(_emails.toString(), _emails.length + ' ' + bkTranslate('@membership.operation.copyEmail.conf'));
  }

  /*-------------------------- exports --------------------------------*/
  public async export(): Promise<void> {
    const _index = await this.selectExportType();
    if (_index === undefined) return;
    if (_index === 0) {
      await this.exportAddressesFromJoinedList('');
      // tbd: check whether it really is a joined list. Currently, it is only callable from ScsContactsListComponent
      //await exportXlsx(this.filteredItems(), 'all', 'all');
    }
    if (_index === 1) await this.exportSrvList('srv');
    if (_index === 2) await this.exportAddressList('address');
  }

  private async selectExportType(): Promise<number | undefined> {
    const _modal = await this.modalController.create({
      component: BkLabelSelectModalComponent,
      componentProps: {
        labels: [
          '@membership.operation.select.default', 
          '@membership.operation.select.srv', 
          '@membership.operation.select.address'
        ],
        icons: ['list-circle-outline', 'menu-outline', 'list-outline'],
        title: '@membership.operation.select.title'
      }
    });
    _modal.present();
    const { data, role } = await _modal.onDidDismiss();
    if (role === 'confirm') {
      if (data !== undefined) {
        return parseInt(data);
      }
    }
    return undefined;
  }

  // we start with SCS members list. For each SCS member, we read its SRV member and subject, and merge to the needed information.
  public async exportSrvList(tableName: string): Promise<void> {
    const _table: string[][] = [];
    _table.push(getSrvHeaderRow());
    for (const _member of this.filteredItems()) {
      this.addSrvRowToTable(_table, _member);
    }
    // add all Austritte from last year with SRV info to this list
    const _exits = await firstValueFrom(this.getAllExitsFromLastYear());
    for (const _exit of _exits) {
      this.addExitedMembershipsToTable(_table, _exit);
    }
    exportXlsx(_table, getExportFileName('scsSrv', EXPORT_FORMATS[ExportFormat.XLSX].abbreviation), tableName);
  }
  
  private async addSrvRowToTable(table: string[][], member: BaseModel): Promise<void> {
    if (isMembership(member)) {
      const _row = await (member.objectKey === OrgKey.SCS ? this.getSrvRowFromScsMember(member) : this.getSrvRowFromSrvMember(member));
      if (_row) table.push(_row);       
    }
  }

  private async addExitedMembershipsToTable(table: string[][], member: BaseModel): Promise<void> {
    if (isMembership(member)) {
      const _mcat = await this.getMembershipByDate(member.subjectKey);
      if (_mcat) {
        console.log(`${member.subjectName2} ${member.subjectName} is still member of SCS with category ${getCategoryAbbreviation(ScsMemberTypes, _mcat)} and validTo ${member.validTo}`);
      } else {  // exited
        const _row = await this.getSrvRowFromScsMember(member);
        if (_row) table.push(_row);         
      }
    }
  }

  private getAllExitsFromLastYear(): Observable<BaseModel[]> {
    return this.dataService.searchData(CollectionNames.Membership, [
      { key: 'objectKey', operator: '==', value: OrgKey.SCS },
      { key: 'state', operator: '==', value: MembershipState.Active },
      { key: 'validTo', operator: '>=', value: getStartOfYear(-1)+'' },
      { key: 'validTo', operator: '<=', value: getEndOfYear(-1)+'' }
    ], 'validTo', 'desc');
  }

  private async getSrvRowFromScsMember(scsMember: RelationshipModel): Promise<string[] | undefined> {
    const _srvMember$ = this.dataService.searchData(CollectionNames.Membership, [
      { key: 'objectKey', operator: '==', value: OrgKey.SRV },
      { key: 'subjectKey', operator: '==', value: scsMember.subjectKey },
    ], 'validFrom', 'desc');     // the sorting is to select the last membership
    
    //this.dataService.readModel(CollectionNames.Membership, _scsMember.bkey);
    const _person$ = this.dataService.readModel(CollectionNames.Subject, scsMember.subjectKey);
    return await firstValueFrom(combineLatest([_srvMember$, _person$]).pipe(map(([_srvMembers, _person]) => {
      if (_srvMembers.length > 0) {
        return (isMembership(_srvMembers[0]) && isSubject(_person)) ? convertToSrvDataRow(_person, scsMember, _srvMembers[0]) : undefined;
      } else {
        return (isSubject(_person)) ? convertToSrvDataRow(_person, scsMember, undefined) : undefined;
      }
    }))); 
  }

  private async getSrvRowFromSrvMember(srvMember: RelationshipModel): Promise<string[] | undefined> {
    const _scsMember$ = this.dataService.searchData(CollectionNames.Membership, [
      { key: 'objectKey', operator: '==', value: OrgKey.SCS },
      { key: 'subjectKey', operator: '==', value: srvMember.subjectKey },
    ], 'validFrom', 'desc');   // the sorting is to select the last membership
    
    //this.dataService.readModel(CollectionNames.Membership, _scsMember.bkey);
    const _person$ = this.dataService.readModel(CollectionNames.Subject, srvMember.subjectKey);
    return await firstValueFrom(combineLatest([_scsMember$, _person$]).pipe(map(([_scsMembers, _person]) => {
      if (isMembership(_scsMembers[0]) && isSubject(_person)) {
        return convertToSrvDataRow(_person, _scsMembers[0], srvMember);
      } else {
        return undefined;
      }
    }))); 
  }

      
  public async exportAddressList(tableName: string): Promise<void> {
    const _table: string[][] = [];
    const _fn = generateRandomString(10) + '.' + EXPORT_FORMATS[ExportFormat.XLSX].abbreviation;
    _table.push(['SubjectKey', 'MembershipKey', 'Vorname', 'Name', 'Strasse', 'PLZ', 'Ort', 'Telefon', 'Email', 'Geburtsdatum', 'Eintrittsdatum', 'MKat']);
    for (const _item of this.filteredItems()) {
      const _member = _item as RelationshipModel;
      const _person = await firstValueFrom(this.dataService.readModel(CollectionNames.Subject, _member.subjectKey)) as SubjectModel;
      if (_person) {
        _table.push([
          _person.bkey!,
          _member.bkey!,
          _person.firstName,
          _person.name,
          _person.fav_street,
          _person.fav_zip,
          _person.fav_city,
          _person.fav_phone,
          _person.fav_email,
          _person.dateOfBirth,
          _member.relLog.substring(0, 4),
          getCategoryAbbreviation(ScsMemberTypes, _member.subType)
        ]);
      }
    }
    exportXlsx(_table, _fn, tableName);
  }

  public async exportAddressesFromJoinedList(tableName: string): Promise<void> {
    const _table: string[][] = [];
    const _fn = generateRandomString(10) + '.' + EXPORT_FORMATS[ExportFormat.XLSX].abbreviation;
    _table.push(['SubjectKey', 'MembershipKey', 'Vorname', 'Name', 'Strasse', 'PLZ', 'Ort', 'Telefon', 'Email', 'Geburtsdatum', 'Eintrittsdatum', 'MKat']);
    for (const _item of this.filteredItems()) {
      const _member = _item as MembershipSubjectModel;
      _table.push([
        _member.subjectKey,
        _member.bkey!,
        _member.subjectName2, 
        _member.subjectName, 
        _member.subjectStreet, 
        _member.subjectZipCode, 
        _member.subjectCity, 
        _member.subjectPhone, 
        _member.subjectEmail, 
        _member.subjectDateOfBirth,
        _member.relLog.substring(0, 4),
        getCategoryAbbreviation(ScsMemberTypes, _member.subType)
      ]);
    }
    exportXlsx(_table, _fn, tableName);
  }

  public async getMembershipByDate(subjectKey: string, evalDate = getTodayStr(DateFormat.StoreDate), orgKey = OrgKey.SCS): Promise<number | undefined> {
    const _memberships = await firstValueFrom(this.dataService.searchData(CollectionNames.Membership, [
      { key: 'objectKey', operator: '==', value: orgKey },
      { key: 'subjectKey', operator: '==', value: subjectKey },
      { key: 'validFrom', operator: '<=', value: evalDate },
    ], 'validFrom', 'desc'));        // keep open membership (empty string) at the beginning of the list
    if (_memberships.length === 0) return undefined;      // the given subjectKey does not have any memberships
    if (_memberships.length > 1) {
      warn(`MembershipService.getMembershipByDate: there are ${_memberships.length} memberships for ${subjectKey} on ${evalDate} (overlapping memberships should not exist).`);
      return undefined;
    }
    const _membership = _memberships[0] as RelationshipModel;
    if (isMembership(_membership)) {
      if (_membership.validTo >= evalDate) return _membership.subType;   // there is a current membership (either ScsMemberType or MemberType)
    }
    return undefined;   // member exited before evalDate
  }
  

  /*-------------------------- search index --------------------------------*/
  public getSearchIndex(item: BaseModel): string {
    return getRelationshipIndex(item);
  }

  public getSearchIndexInfo(): string {
    return getRelationshipIndexInfo();
  }
}