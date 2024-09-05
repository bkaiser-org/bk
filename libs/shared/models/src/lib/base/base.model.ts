import { CategoryType } from '@bk/categories';
import { OrgNewFormModel } from '../org/org-new.model';
import { PersonNewFormModel } from '../person/person-new.model';
import { ResourceNewFormModel } from '../resource/resource-new.model';
import { AddressFormModel } from '../address/address-form.model';
import { SectionFormModel } from '../section/section-form.model';
import { OrgFormModel } from '../org/org-form.model';
import { PersonFormModel } from '../person/person-form.model';
import { ResourceFormModel } from '../resource/resource-form.model';
import { MembershipFormModel } from '../membership/membership-form.model';
import { SectionModel } from '../section/section.model';
import { AddressModel } from '../address/address.model';
import { RelationshipModel } from '../relationship/relationship.model';
import { CommentModel } from '../comment/comment.model';
import { ResourceModel } from '../resource/resource.model';
import { InvoicePositionModel } from '../invoice-position/invoice-position.model';
import { DocumentModel } from '../document/document.model';
import { CompetitionLevelModel } from '../competition-level/competition-level.model';
import { EventModel } from '../event/event.model';
import { LocationModel } from '../location/location.model';
import { PageModel } from '../page/page.model';

export type NewFormModel = OrgNewFormModel | PersonNewFormModel | ResourceNewFormModel | AddressFormModel | SectionFormModel;
export type FormModel = OrgFormModel | PersonFormModel | ResourceFormModel | MembershipFormModel;
export type Model = SectionModel | AddressModel | RelationshipModel | CommentModel | ResourceModel | PageModel | 
EventModel | LocationModel |
InvoicePositionModel | DocumentModel | CompetitionLevelModel;

export interface FieldDescription {
  name: string;
  label: string;
  value: boolean;
}

// ConfigService can not be injected in the BaseModel constructor
// because Angular instantiates a child class, which effectively initialises the parent class.
export class BaseModel {
  public bkey? = '';
  public name= '';
  public tenant: string[] = [];
  public category = CategoryType.Undefined as number;
  public url = '';
  public index = '';
  public isArchived = false;
  public isTest = false;
  public tags = '';        // a list of numbers, e.g. 1,2,3 = indexes in tagTemplate
  public modelType = CategoryType.Undefined as number;
  public description = '';
}

export const BASE_FIELDS: FieldDescription[] = [
    { name: 'bkey',             label: 'bkey',          value: false },
    { name: 'name',             label: 'name',          value: true },
    { name: 'tenant',           label: 'tenant',        value: false },
    { name: 'category',         label: 'category',      value: false },
    { name: 'url',              label: 'url',           value: false },
    { name: 'index',            label: 'index',         value: false },
    { name: 'isArchived',       label: 'isArchived',    value: false },
    { name: 'isTest',           label: 'isTest',        value: false },
    { name: 'tags',             label: 'tags',          value: false },
    { name: 'modelType',        label: 'modelType',     value: false },        
    { name: 'description',      label: 'description',   value: false }
];
