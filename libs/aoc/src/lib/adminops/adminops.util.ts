/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataService, listModelsBySingleQuery } from "@bk/base";
import { AddressChannel, ModelType, ModelValidationType, OrgKey, RelationshipType, ScsMemberType, ScsMemberTypes, getCategoryAbbreviation, getMembershipPrice, getScsMembershipPrice } from "@bk/categories";
import { AddressModel, BaseModel, RelationshipModel, SubjectModel, addressValidations, commentValidations, competitionLevelValidations, documentValidations, eventValidations, invoicePositionValidations, isAddress, isComment, isCompetitionLevel, isDocument, isEvent, isInvoicePosition, isLocation, isMembership, isPage, isRelationship, isResource, isSection, isSubject, isUser, locationValidations, pageValidations, relationshipValidations, resourceValidations, sectionValidations, subjectValidations, userValidations } from "@bk/models";
import { CollectionNames, DateFormat, END_FUTURE_DATE_STR, compareDate, convertDateFormatToString, getAge, getEndOfYear, getFullPersonName, getTodayStr, getYear } from "@bk/util";
import { updateMembershipAttributesPerOrg } from "@bk/membership";
import { firstValueFrom, take } from "rxjs";
import { deleteField, getFirestore } from "firebase/firestore";

export interface LogInfo {
  id: string,
  name: string,
  message: string
}

export function getLogInfo(key: string | undefined, name: string | undefined, message: string, isVerbose = true): LogInfo {
if (isVerbose === true) console.log(`${key}/${name}: ${message}`);
return {
    id: key ?? '',
    name: name ?? '',
    message: message
};
}

export function validateModel(modelValidationType: ModelValidationType, model: BaseModel) {
  switch (modelValidationType) {
    case ModelValidationType.Subject:
      return isSubject(model) ? subjectValidations(model) : undefined;
    case ModelValidationType.Resource:
      return isResource(model) ? resourceValidations(model) : undefined;
    case ModelValidationType.CompetitionLevel:
      return isCompetitionLevel(model) ? competitionLevelValidations(model) : undefined;
    case ModelValidationType.Event:
      return isEvent(model) ? eventValidations(model) : undefined;
    case ModelValidationType.Document:
      return isDocument(model) ? documentValidations(model) : undefined;
    case ModelValidationType.Location:
      return isLocation(model) ? locationValidations(model) : undefined;
    case ModelValidationType.Ownership:
    case ModelValidationType.Membership:
      return isRelationship(model) ? relationshipValidations(model) : undefined;
    case ModelValidationType.Page:
      return isPage(model) ? pageValidations(model) : undefined;
    case ModelValidationType.Section:
      return isSection(model) ? sectionValidations(model) : undefined;
    case ModelValidationType.User:
      return isUser(model) ? userValidations(model) : undefined;
    case ModelValidationType.InvoicePosition:
      return isInvoicePosition(model) ? invoicePositionValidations(model) : undefined;
    case ModelValidationType.Address:
      return isAddress(model) ? addressValidations(model) : undefined;
    case ModelValidationType.Comment:
      return isComment(model) ? commentValidations(model) : undefined;
    default: return undefined;
  }
}

export interface OpSignature {
  modelValidationType?: ModelValidationType,
  model: any,
  logInfo: LogInfo[],
  dataService?: DataService,
}

  export const validateFunction = (sig: OpSignature): Promise<void> => {
    if (!sig.modelValidationType) return Promise.resolve();
    const _validationResults = validateModel(sig.modelValidationType, sig.model);
  if (_validationResults && _validationResults.hasErrors()) {
    console.log(`validation errors on ${sig.model.bkey}: `, _validationResults.getErrors());
    sig.logInfo.push(getLogInfo(sig.model.bkey, sig.model.name, `${_validationResults.errorCount} validation errors`));
  } else {
    sig.logInfo.push(getLogInfo(sig.model.bkey, sig.model.name, 'ok'));
  }
  return Promise.resolve();
}

/******************************************************************************************************************* */
// THIS fix function is adapted for each run !!!
// do not forget to adapt the modelValidationType in the calling function adminops.fixModels()
export const fixFunction = async (sig: OpSignature): Promise<void> => {
  if (!sig.dataService) return Promise.resolve()
  const _membership = sig.model;
  if (isMembership(_membership) && _membership.modelType === ModelType.Relationship 
    && _membership.category === RelationshipType.Membership && _membership.bkey) {
      const _bexioId = _membership.properties.bexioId;
    // if the membership has a bexioId
    if (_bexioId) {
      // get the corresponding subject
      const _subject = await firstValueFrom(sig.dataService.readModel(CollectionNames.Subject, _membership.subjectKey)) as SubjectModel;
      // add the bexioID into the subject
      _subject.bexioId = _bexioId;
      try {
        console.log(`AOC.fixFunction: updating subject ${_subject.bkey} with bexioId ${_subject.bexioId}`);
        //await sig.dataService.updateModel(ModelValidationType.Subject, _subject);
      }
      catch(error) {
        console.log(`AOC.fixFunction: error updating subject ${_subject.bkey}: `, error);
      }
      // delete the property bexioId from the memberships
      _membership.properties.bexioId = deleteField() as unknown as string;
      try {
        console.log(`AOC.fixFunction: deleting bexioId ${_bexioId} from membership ${_membership.bkey}` )
        //await sig.dataService.updateModel(ModelValidationType.Membership, _membership);
      }
      catch(error) {
        console.log(`AOC.fixFunction: error updating membership ${_membership.bkey}: `, error);
      }
    }
  }
  return Promise.resolve();
}

 /*    // disable the following lines to avoid updating the model
    try {
      if (modelValidationType === ModelValidationType.Address) { // CollectionGroup
        // BEWARE: this is destructive !
        //await setDoc(doc(getFirestore(), `${CollectionNames.Subject}/${_newModel.parentKey}/${modelValidationType}`, oldModel['bkey']), _newModel);
        // usually, do it non-destructive like this (in this case, _newModel must contain a bkey. This is removed in the updateModel function): 
        // await dataService.updateModel(`${CollectionNames.Subject}/${_newModel.parentKey}/${modelValidationType}`, _newModel);
      } else if (modelValidationType === ModelValidationType.Comment) { // CollectionGroup
        console.log(`set comment on ${_newModel.parentCollection}/${_newModel.parentKey}/${modelValidationType}/${oldModel['bkey']}`);
        // BEWARE: this is destructive !
        //await setDoc(doc(getFirestore(), `${_newModel.parentCollection}/${_newModel.parentKey}/${modelValidationType}`, oldModel['bkey']), _newModel);
        // usually, do it non-destructive like this (in this case, _newModel must contain a bkey. This is removed in the updateModel function):
        // await dataService.updateModel(`${_newModel.parentCollection}/${_newModel.parentKey}/${modelValidationType}`, _newModel);
      } else {    // Collection (in this case, _newModel must contain a bkey. This is removed in the updateModel function)
        // await dataService.updateModel(modelValidationType, model);
      }
      // logInfo.push(getLogInfo(model.bkey, model.name, 'fixed'));  
    }
    catch (error) {
      console.log('error on ' + _newModel.parentKey + '/' + oldModel['bkey'] + ': ', error);
    }
  }
  return Promise.resolve();
} */
/******************************************************************************************************************* */

  export const listIbanFunction = async (sig: OpSignature): Promise<void> => {
  if (isSubject(sig.model)) {
    const _collName = CollectionNames.Subject + '/' + sig.model.bkey + '/' + CollectionNames.Address;
    const _addresses = await firstValueFrom(listModelsBySingleQuery(getFirestore(), _collName, sig.model.tenant, 'category', AddressChannel.BankAccount, '==', 'name', 'asc')) as AddressModel[];
    if (_addresses?.length > 0) {
      for (let i = 0; i < _addresses.length; i++) {
        console.log(sig.model.bkey, sig.model.firstName + ' ' + sig.model.name, _addresses[i].name);
        sig.logInfo.push(getLogInfo(sig.model.bkey, sig.model.firstName + ' ' + sig.model.name, _addresses[i].name));
      }
    }
  }
}

  export const listOldJuniorsFunction = async (sig: OpSignature): Promise<void> => {
  if (isMembership(sig.model)) {
    if (sig.model.objectKey === OrgKey.SCS && sig.model.subType === ScsMemberType.Junioren 
        && sig.model.isArchived === false && sig.model.isTest === false && sig.model.tenant === 'scs'
        && sig.model.relIsLast === true && compareDate(sig.model.validTo, getEndOfYear()+'') > 0)
    {
      // check for objectKey = OrgKey.SCS, subType = 4, isArchived = false, isTest = false
      const _refYear = getYear() - 18;
      const _dateOfBirth = sig.model.properties.dateOfBirth;
      if (!_dateOfBirth) {
        sig.logInfo.push(getLogInfo(sig.model.bkey, sig.model.name, 'SCS junior has no dateOfBirth'));
      } else {
        const _birthYear = Number(convertDateFormatToString(_dateOfBirth, DateFormat.StoreDate, DateFormat.Year));
        if (_birthYear < _refYear) {
          sig.logInfo.push(getLogInfo(sig.model.bkey, getFullPersonName(sig.model.subjectName2, sig.model.subjectName), convertDateFormatToString(_dateOfBirth, DateFormat.StoreDate, DateFormat.ViewDate)));
        }  
      }
    }
  }
}

export const checkJuniorEntryFunction = async (sig: OpSignature): Promise<void> => {
  if (isMembership(sig.model) && sig.model.subjectType === ModelType.Person && sig.model.priority === 1 && sig.model.subType != ScsMemberType.Junioren) {
    const _refYear = parseInt(sig.model.validFrom.substring(0, 4));
    const _dateOfBirth = sig.model.properties.dateOfBirth;
    if (!_dateOfBirth) {
      sig.logInfo.push(getLogInfo(sig.model.bkey, getFullPersonName(sig.model.subjectName2, sig.model.subjectName), 'SCS member has no dateOfBirth'));
    } else if(getAge(_dateOfBirth, false, _refYear) < 19) {
      const _mCat = getCategoryAbbreviation(ScsMemberTypes, sig.model.subType);
      const _birthYear = parseInt(_dateOfBirth.substring(0, 4));
      const _activEntry = _birthYear + 19 + '0101';
      const _prefix = _mCat + ':' + sig.model.validFrom + '-' + sig.model.validTo + '/A:' + _activEntry + ' -> ';
      if (sig.model.validTo === END_FUTURE_DATE_STR) {
        // if _activEntry > today, then the membership is still active
        if (compareDate(_activEntry, getTodayStr(DateFormat.StoreDate)) > 0) {
          sig.logInfo.push(getLogInfo(sig.model.bkey, getFullPersonName(sig.model.subjectName2, sig.model.subjectName), _prefix + 'J:' + sig.model.validFrom + '-99991231'));
        } else {
          sig.logInfo.push(getLogInfo(sig.model.bkey, getFullPersonName(sig.model.subjectName2, sig.model.subjectName), _prefix + 'J:' + sig.model.validFrom + ', ' + _mCat + ':' + _activEntry + '-99991231'));
        }
      } else 
      if (compareDate(sig.model.validTo, _activEntry) > 0) {    // validTo > _activEntry
        sig.logInfo.push(getLogInfo(sig.model.bkey, getFullPersonName(sig.model.subjectName2, sig.model.subjectName), _prefix + 'J:' + sig.model.validFrom + ', ' + _mCat + ':' + _activEntry + '-' + sig.model.validTo));
      } else {
        sig.logInfo.push(getLogInfo(sig.model.bkey, getFullPersonName(sig.model.subjectName2, sig.model.subjectName), _prefix + 'J:' + sig.model.validFrom + '-' + sig.model.validTo));
      }  
    }
  }
}

export const updateMembershipPrices = async (sig: OpSignature): Promise<void> => {
  if (isMembership(sig.model)) {
    if (compareDate(sig.model.validTo, getTodayStr()) > 0) {  // only currently active memberships should be updated
      if (sig.model.objectKey === OrgKey.SCS) {
        sig.model.price = getScsMembershipPrice(sig.model.subType);
      } else if (sig.model.objectKey === OrgKey.SRV) {
        sig.model.price = getMembershipPrice(sig.model.subType);
      } else {
        sig.model.price = 0;
      }
      sig.logInfo.push(getLogInfo(sig.model.bkey, sig.model.subjectName2 + ' ' + sig.model.subjectName, sig.model.price + ''));
      // tbd: only update for currently active memberships (validTo > today)
      // await dataService.updateModel(modelValidationType, model);
    }
  }
}

export const updateMembershipAttributes = async (sig: OpSignature): Promise<void> => {
  const _dataService = sig.dataService;
  if (!_dataService) return Promise.resolve()
  if (isSubject(sig.model) && sig.model.modelType === ModelType.Person && sig.model.bkey) {

    // 1) get all relationships of the subject
    _dataService.listModelsBySingleQuery(CollectionNames.Membership, 'subjectKey', sig.model.bkey, '==', 'validFrom', 'asc').pipe(take(1))
      .subscribe(async (_relationships: BaseModel[]) => {
        console.log('fixing person: ' + sig.model.bkey + '/' + sig.model.firstName + ' ' + sig.model.name);

        console.log('  SCS:');
        updateMembershipAttributesPerOrg(_relationships as RelationshipModel[], OrgKey.SCS, _dataService);

        console.log('  SRV:');
        updateMembershipAttributesPerOrg(_relationships as RelationshipModel[], OrgKey.SRV, _dataService);

        console.log('  Other:');
        updateMembershipAttributesPerOrg(_relationships as RelationshipModel[], OrgKey.Other, _dataService);
      });
  }
}
