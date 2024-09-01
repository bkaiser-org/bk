/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject } from "@angular/core";
import { DataService } from "@bk/base";
import { GenderType, MembershipState, ModelValidationType, OrgKey, RelationshipType } from "@bk/categories";
import { AgeByGenderStatistics, BkButtonComponent, BkHeaderComponent, BkCatComponent, CategoryByGenderStatistics, initializeAgeByGenderStatistics, initializeCategoryByGenderStatistics, updateAgeByGenderStats, updateCategoryByGenderStats } from "@bk/ui";
import { CollectionNames, warn, FIRESTORE } from "@bk/util";
import { BehaviorSubject, firstValueFrom, map, Observable } from "rxjs";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonItem, IonRow, IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { TranslatePipe } from "@bk/pipes";
import { AsyncPipe } from "@angular/common";
import { CompetitionLevelModel, RelationshipModel, isCompetitionLevel, isMembership } from "@bk/models";
import { CompetitionLevelStatistics, createCompetitionLevelFromScsMembership, initializeCLStatistics } from "@bk/competition-level";
import { LogInfo, OpSignature, checkJuniorEntryFunction, fixFunction, getLogInfo, listIbanFunction, listOldJuniorsFunction, updateMembershipAttributes, updateMembershipPrices, validateFunction } from "./adminops.util";
import { collection, getDocs, collectionGroup, QueryDocumentSnapshot } from "firebase/firestore";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'bk-adminops',
  standalone: true,
  imports: [
    TranslatePipe, AsyncPipe,
    BkHeaderComponent, BkButtonComponent, BkCatComponent,
    IonContent, IonCardHeader, IonCardTitle, IonCardContent, IonCard,
    IonGrid, IonRow, IonCol, IonSelect, IonSelectOption, IonItem,
    FormsModule
  ],
  templateUrl: 'adminops.html'
})
export class AdminOpsComponent {
  private dataService = inject(DataService);
  private firestore = inject(FIRESTORE);

  public logInfo: LogInfo[] = [];
  private _logTitle = new BehaviorSubject<string>('');
  public logTitle$ = this._logTitle.asObservable();
  public RT = RelationshipType;
  public MVT = ModelValidationType;
  public clStats: CompetitionLevelStatistics | undefined;
  public ageByGenderStats: AgeByGenderStatistics | undefined;
  public categoryByGenderStats: CategoryByGenderStatistics | undefined;
  public selectedModelValidationType = ModelValidationType.Subject;

  /**
   * Fix models of a given type. THIS CHANGES MANY DATA IN THE DATABASE.
   * The purpose of this function is to apply corrections as a bulk operation over all models of a given type.
   * The function is normally called once and then new logic is implemented for the next correction.
   * That's why we only keep one single function that is used for all models.
   * CHANGE THE ModelValidationType HERE AND THE IMPLEMENTATION OF THE fixFunction IN adminops.util.ts
   * To test your fix function, use executeAocOperationOnce() or do a dry run (not updating the data) first.
   */
  public async fixModels(): Promise<void> {
    this.executeAocOperation(ModelValidationType.Membership, 'Fixing', fixFunction);
  }

  /**
   * Validate models of a given type. This checks the data in one collection of the database whether it is valid.
   * Use executeAocOperationOnce() for testing your operation.
   * @param modelValidationType the name of the collection to validate
   */
  public async validateModels(modelValidationType: ModelValidationType): Promise<void> {
    this.executeAocOperation(modelValidationType, 'Validating', validateFunction);
  }

  private async executeAocOperation(modelValidationType: ModelValidationType, opLabel: string, op: (sig: OpSignature) => Promise<void>): Promise<void> {
    this.logInfo = [];
    let _counter = 0;
    this._logTitle.next(`Reading collection ${modelValidationType}`);
    const _snapshot =  (modelValidationType === ModelValidationType.Address || modelValidationType === ModelValidationType.Comment) ?
      await getDocs(collectionGroup(this.firestore, modelValidationType.toString())) :
      await getDocs(collection(this.firestore, modelValidationType.toString()));
    const _collName = (modelValidationType === ModelValidationType.Address || modelValidationType === ModelValidationType.Comment) ? 'collectionGroup' : 'collection';
    this._logTitle.next(`${opLabel} ${_snapshot.size} items in ${_collName} ${modelValidationType}`);
    _snapshot.forEach((_doc) => {
      //if (_counter > 3) return;
      const _model = _doc.data();
      _model['bkey'] = _doc.id;
      if (modelValidationType === ModelValidationType.Address) {
        // check for parentCollections (we want to ensure that we do not change anything in old Collection subjects. 
        // Only Collection subjects2 should be changed.)
        if (_doc.ref.parent.parent?.parent?.id === CollectionNames.Subject) {
          _counter++;
          op({ modelValidationType: modelValidationType, model: _model, logInfo: this.logInfo, dataService: this.dataService });
        }
      }  else if (modelValidationType === ModelValidationType.Comment) {          
        /********************************************** */
        // CHECK FOR ONLY NEW COLLECTIONS !! (before updating the data))
        // subjects2, resources6, memberships3, ownerships2, applications
        const _parentKey = _doc.ref.parent.parent?.id;
        const _parentCollection = _doc.ref.parent.parent?.parent?.id;
        if (_parentCollection === CollectionNames.Subject || _parentCollection === CollectionNames.Resource || 
            _parentCollection === CollectionNames.Membership || _parentCollection === CollectionNames.Ownership) {
          _counter++;
          _model['parentKey'] = _parentKey;
          _model['parentCollection'] = _parentCollection;
          op({ modelValidationType: modelValidationType, model: _model, logInfo: this.logInfo, dataService: this.dataService });
        }

          /********************************************** */
      } else {
        _counter++;
        op({ modelValidationType: modelValidationType, model: _model, logInfo: this.logInfo, dataService: this.dataService });
      }
    });
    console.log(_counter + ' models processed.');
    this.logInfo.push(getLogInfo('', '', 'DONE'));
  }

  // for testing purposes, the operation is applied to only one model
  private async executeAocOperationOnce(modelValidationType: ModelValidationType, opLabel: string, op: (sig: OpSignature) => Promise<void>): Promise<void> {
    this.logInfo = [];
    this._logTitle.next(`Reading first model of collection ${modelValidationType}`);
    let _collName: string;
    let _document: QueryDocumentSnapshot;
    if (modelValidationType === ModelValidationType.Address || modelValidationType === ModelValidationType.Comment) {
      _collName = 'collectionGroup';
      _document = (await getDocs(collectionGroup(this.firestore, modelValidationType.toString()))).docs[0];
    } else {
      _collName = 'collection';
      _document = (await getDocs(collection(this.firestore, modelValidationType.toString()))).docs[0];
    }
    const _model = _document.data();
    if (modelValidationType === ModelValidationType.Address || modelValidationType === ModelValidationType.Comment) {
      _model['parentKey'] = _document.ref.parent.parent?.id;
    }
    this._logTitle.next(`${opLabel} one item in ${_collName} ${modelValidationType}`);
    console.log(`${opLabel} first model: `, _model);
    op({ modelValidationType: modelValidationType, model: _model, logInfo: this.logInfo, dataService: this.dataService });
    this.logInfo.push(getLogInfo('', '', 'DONE'));
  }

  public changeModelValidationType(modelValidationType: ModelValidationType): void {
    this.selectedModelValidationType = modelValidationType;
  }

  // -------------------------------------------------------------------
  //        List IBAN
  // -------------------------------------------------------------------
  public async listIban(): Promise<void> {
    this.executeAocOperation(ModelValidationType.Subject, 'Listing IBAN from ', listIbanFunction);
  }

  // -------------------------------------------------------------------
  //        List Old Juniors
  // -------------------------------------------------------------------
  public async listOldJuniors(): Promise<void> {
    this.executeAocOperation(ModelValidationType.Membership, 'Listing old juniors from ', listOldJuniorsFunction);
  }

  public async updateMembershipPrices(): Promise<void> {
    this.executeAocOperation(ModelValidationType.Membership, 'Updating membership prices in ', updateMembershipPrices);
  }

  public async updateMembershipAttributes(): Promise<void> {
    this.executeAocOperation(ModelValidationType.Subject, 'Updating membership attributes in ', updateMembershipAttributes);
  }


  // -------------------------------------------------------------------
  //        Check Entries for Juniors
  // -------------------------------------------------------------------
  public async checkJuniorEntry(): Promise<void> {
    this.executeAocOperation(ModelValidationType.Membership, 'Check Junior Entries ', checkJuniorEntryFunction);
  }

  // -------------------------------------------------------------------
  //        Find orphaned sections
  // -------------------------------------------------------------------
  public async findOrphanedSections(): Promise<void> {
    console.log('findOrphanedSections: not yet implemented');
  }

  // -------------------------------------------------------------------
  //        Update Competition Levels
  // -------------------------------------------------------------------
  public async updateCompetitionLevels(): Promise<void> {
    console.log('competition-levels aktualisieren...');
    let _counterCreated = 0;
    console.log('not yet implemented');

    // phase 1: for each active member (mid): create it in cl if it does not yet exist
    const _activeScsMembers = await firstValueFrom(this.dataService.searchData(CollectionNames.Membership, [
      { key: 'objectKey', operator: '==', value: OrgKey.SCS },
      { key: 'state', operator: '==', value: MembershipState.Active }
    ]));
    for (const _scsMember of _activeScsMembers) {
      if (isMembership(_scsMember)) {
        _counterCreated += await this.checkAndCreateMissingCompetitionLevels(_scsMember);
      }
    }
    console.log(`checked ${_activeScsMembers.length} members and created ${_counterCreated} competitionLevelItems`);

    // phase 2: check each cl item and update/delete if necessary
    const _clItems = await firstValueFrom(this.dataService.searchData(CollectionNames.CompetitionLevel, []));

    for (const _clItem of _clItems) {
      if (isCompetitionLevel(_clItem)) {
        //let _isDirty = TripleBoolType.False;

        // tbd: optimize these checks, are they really needed ?
        // if (await checkMembershipInformation(this.afs, _clItem) === TripleBoolType.True) _isDirty = TripleBoolType.True;
        // if (await checkLicenseInformation(this.afs, _clItem) === true) _isDirty = TripleBoolType.True;
        //if (_isDirty === TripleBoolType.True) {
          await this.dataService.updateModel(CollectionNames.CompetitionLevel, _clItem);
        //}
        this.updateCLStatisticsWithSingleValue(_clItem);
      }
    }
    if (this.clStats) {
      this.dataService.createObject(CollectionNames.Statistics, this.clStats, 'competitionLevels');
    } else {
      warn('bk3migration.updateCompetitionLevels: clStats is undefined');
    }
  }

  private async checkAndCreateMissingCompetitionLevels(scsMember: RelationshipModel): Promise<number> {
    console.log('checking ' + scsMember.bkey + '/' + scsMember.subjectName2 + ' ' + scsMember.subjectName);
    const _clItem = await firstValueFrom(this.dataService.readModel(CollectionNames.CompetitionLevel, scsMember.subjectKey));
    if (_clItem === undefined) {
      const _birthdate = scsMember.properties.dateOfBirth;
      if (!_birthdate) return 0;
      const _clModel = createCompetitionLevelFromScsMembership(scsMember, _birthdate);
      await this.dataService.createModel(CollectionNames.CompetitionLevel, _clModel);
      return 1;
    }
    return 0;
  }
  
  public async updateCLStatistics(): Promise<void> {
    this.clStats = initializeCLStatistics();
    const _clItems = await firstValueFrom(this.dataService.searchData(CollectionNames.CompetitionLevel, []));
    
    // tbd: gender other is not yet considered
    for (const _clItem of _clItems) {
      if (isCompetitionLevel(_clItem)) {
        this.updateCLStatisticsWithSingleValue(_clItem);
      }
    }
    console.log('bk3migration.updateCLStatistics: saving updated statistics:');
    console.log(this.clStats);
    this.dataService.createObject(CollectionNames.Statistics, this.clStats, 'competitionLevels');
  }

  private updateCLStatisticsWithSingleValue(clItem: CompetitionLevelModel): void {
    if (this.clStats && clItem && clItem.category >= 0 && clItem.competitionLevel >= 0) {
      clItem.category === GenderType.Female ?
        this.clStats.entries[clItem.competitionLevel].f++ :
        this.clStats.entries[clItem.competitionLevel].m++;
      this.clStats.entries[clItem.competitionLevel].total++;
    }
  }

    // -------------------------------------------------------------------
  //        Update Age By Gender Structure
  // -------------------------------------------------------------------
  public async updateAgeByGender(): Promise<void> {
  console.log('age structure (by gender) aktualisieren...');
  this.ageByGenderStats = initializeAgeByGenderStatistics();

  // for all active SCS members...
  const _activeScsMembers = await firstValueFrom(this.dataService.searchData(CollectionNames.Membership, [
    { key: 'objectKey', operator: '==', value: OrgKey.SCS },
    { key: 'state', operator: '==', value: MembershipState.Active }
  ]));
    
  for (const _scsMember of _activeScsMembers) {
    if (isMembership(_scsMember)) {
      updateAgeByGenderStats(this.ageByGenderStats, _scsMember.subjectCategory, _scsMember.properties.dateOfBirth);
    }
  }
  // save the statistics
  console.log('bk3migration.updateAgeByGender: saving updated statistics:');
  console.log(this.ageByGenderStats);
  this.dataService.createObject(CollectionNames.Statistics, this.ageByGenderStats, 'ageByGender');
}

    // -------------------------------------------------------------------
  //        Update Category By Gender Structure
  // -------------------------------------------------------------------
  public async updateCategoryByGender(): Promise<void> {
    console.log('category structure (by gender) aktualisieren...');
    this.categoryByGenderStats = initializeCategoryByGenderStatistics();

    // for all active SCS members...
    const _activeScsMembers = await firstValueFrom(this.dataService.searchData(CollectionNames.Membership, [
      { key: 'objectKey', operator: '==', value: OrgKey.SCS },
      { key: 'state', operator: '==', value: MembershipState.Active }
    ]));
      
    for (const _scsMember of _activeScsMembers) {
      if (isMembership(_scsMember)) {
        updateCategoryByGenderStats(this.categoryByGenderStats, _scsMember.subjectCategory, _scsMember.subType);
      }
    }
    // save the statistics
    console.log('bk3migration.updateCategoryByGender: saving updated statistics:');
    console.log(this.categoryByGenderStats);
    this.dataService.createObject(CollectionNames.Statistics, this.categoryByGenderStats, 'categoryByGender');
  }
  
  public async updateMemberLocation(): Promise<void> {
    console.log('Herkunft der Aktivmitglieder aktualisieren...');
    // get the zipcodes of all active SCS members...
   // const _activeScsMembers = await firstValueFrom(
    const _zipCodes$ = (this.dataService.searchData(CollectionNames.Membership, [
      { key: 'objectKey', operator: '==', value: OrgKey.SCS },
      { key: 'state', operator: '==', value: MembershipState.Active }
    ]) as Observable<RelationshipModel[]>)    
    .pipe(map((memberships: RelationshipModel[]) => {
      return memberships.map((_membership: RelationshipModel) => {
        return _membership.properties.zipCode;
      })
    }));
    const _zipCodes = await firstValueFrom(_zipCodes$);
    console.log('zipCodes (raw): ', _zipCodes);
    // compute the number of occurrences of each word
    // https://stackoverflow.com/questions/36008637/sort-array-by-frequency
    const _counter = Object.create(null);
    _zipCodes.forEach(function(_zip) {
      if (_zip)  {
        _counter[_zip] = (_counter[_zip] || 0) + 1;
      }
    });
    _zipCodes.sort(function(x, y) {
      if (x && y) return _counter[y] - _counter[x];
      return 0;
    });
    console.log('zipCodes (condensed): ', _zipCodes);
    console.log('counter: ', _counter);
  }
}
