import { Category } from './category-model';
import { ModelType } from './model-type';
import { GenderType, GenderTypes } from './gender-type';
import { OrgKey, OrgTypes } from './org-type';
import { CompetitionLevels } from './competition-level';
import { DocumentTypes } from './document-type';
import { InvoicePositionTypes } from './invoice-position-type';
import { BoatTypes } from './boat-type';
import { ResourceType, ResourceTypes } from './resource-type';
import { SectionTypes } from './section-type';
import { FilterType } from './filter-type';
import { RelationshipType } from './relationship-type';
import { MemberTypes } from './member-type';
import { ScsActiveTypes, ScsMemberType, ScsMemberTypes } from './scs-member-type';
import { MembershipState } from './membership-state';
import { CategoryType } from './category-type';
import { addAllCategory } from './category.util';
import { getYearList, getYear, getTodayStr, DateFormat } from '@bk/util';
import { LocationTypes } from './location-type';
import { MenuActions } from './menu-action';
import { TaskState, TaskStates } from './task-state';

export type QueryValueType = string | number | number[] | boolean; // number[] is needed for: category in [5, 6]

export interface DbQuery {
  key: string,
  operator: string,
  value: QueryValueType
}

export interface SearchConfig {
  fieldName: string,
  placeholder: string,      // = i18nBase + '.searchPlaceholder'
}

export type CategoryConfig = Partial< {
  name: string,
  categories: Category[],
  selectedCategoryId: number,
  fieldName: string,  // default: category (subType, subjectType, state, subjectCategory)
  label: string
}>

export interface YearConfig {
  years: number[],    // e.g. [2021, 2020, 2019, 2018, 2017, 2016]
  selectedYear: number,
  fieldName: string,  // a date field, e.g. validFrom, validTo
  label: string,
  // maybe we add an operator later:  ==, >=, <=, >, <
}

export type ListTypeModel = Partial<{
    id: ListType;
    title: string;
    slug: string;
    modelType: ModelType;
    relationshipType: RelationshipType;
    search: SearchConfig;
    filterType: FilterType;     // Category, Year, None, Both
    category: CategoryConfig;
    type: number;      // e.g. ResourceType.FemaleLocker for ListType.ResourceFemaleLockers
    year: YearConfig;
    initialQuery: DbQuery[];    // the initial query to apply to get the 
    orderBy: string;
    sortOrder: 'asc' | 'desc';
}>;

export enum ListType {
  Undefined,
  PersonAll,
  OrgAll,
  OrgSelectable,
  GroupAll,
  CompetitionLevelAll,
  DocumentAll,
  InvoicePositionAll,
  MemberScsAll,     // all members of SCS = MemberActive + passive  
  MemberScsActive,     // all active members of SCS (juniors, candidates, Ehren, Frei, A1-A3)
  MemberScsPassive,
  MemberScsAlumni,
  MemberScsDeceased,    // all deceased members of SCS (members joined with their subject data)
  MemberScsEntries,
  MemberScsExits,
  MemberScsMen,
  MemberScsWomen,
  MemberSrvAll,
  OwnershipAll,
  OwnershipRowingBoats,
  OwnershipClubBoats,
  OwnershipPrivateBoats,
  OwnershipMaleLockers,
  OwnershipFemaleLockers,
  OwnershipHouseKeys,
  PageAll,
  SectionAll,
  ResourceAll,
  ResourceMaleLockers,
  ResourceFemaleLockers,
  ResourceHouseKeys,
  ResourceRowingBoats,
  RelnoteAll,
  MemberScsContacts,    // all active members of SCS, joined with their subject data
  SubjectAll,
  ReservationAll,
  ReservationBoatHouse,
  EventAll,
  LocationAll,
  MenuItemAll,
  TaskAll,
  TripAll,
  EventYearly
}

// tbd: Ehemalige und Verstorbene aus ScsMemberType entfernen und mit einer Query lösen:
// Ehemalig: hatte membership, aber aktuell keine gültige mehr
// Verstorben: hat dateofDeath und eine frühere Membership

export const ListTypes: ListTypeModel[] = [
  {
    id: ListType.Undefined,
    title: '@categories.listType.undefined.title',
    modelType: ModelType.Subject,
    slug: '',
    filterType: FilterType.None,
    initialQuery: []
  },
    {
      id: ListType.PersonAll,
      title: '@categories.listType.person.all.title',
      modelType: ModelType.Person,
      slug: 'person',
      search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
      filterType: FilterType.Category,
      category: { 
        name: 'gender', 
        categories: addAllCategory(GenderTypes), 
        selectedCategoryId: CategoryType.All, 
        fieldName: 'category',
        label: '@categories.listType.person.all.categoryLabel'
      },
      initialQuery: [
        { key: 'modelType', operator: '==', value: ModelType.Person }
      ]
    },
    {
    id: ListType.OrgAll,
    title: '@categories.listType.org.all.title',
    modelType: ModelType.Org,
    slug: 'org',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Category,
    category: { 
      name: 'orgType', 
      categories: addAllCategory(OrgTypes), 
      selectedCategoryId: CategoryType.All, 
      fieldName: 'category',
      label: '@categories.listType.org.all.categoryLabel'
    },
    initialQuery: [
      { key: 'modelType', operator: '==', value: ModelType.Org }
    ]
  },
  {
    id: ListType.OrgSelectable,
    title: '@subject.org.operation.select.label',
    modelType: ModelType.Org,
    slug: 'org',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Category,
    category: { 
      name: 'orgType', 
      categories: addAllCategory(OrgTypes), 
      selectedCategoryId: CategoryType.All, 
      fieldName: 'category',
      label: '@categories.listType.org.all.categoryLabel'
    },
    initialQuery: [
      { key: 'modelType', operator: '==', value: ModelType.Org }
    ]
  },
  {
    id: ListType.GroupAll,
    title: '@categories.listType.group.all.title',
    modelType: ModelType.Group,
    slug: 'group',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.None,
    initialQuery: [
      { key: 'modelType', operator: '==', value: ModelType.Group }
    ]
  },
  {
    id: ListType.CompetitionLevelAll,
    title: '@categories.listType.competitionLevel.all.title',
    modelType: ModelType.CompetitionLevel,
    slug: 'competitionLevel',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Category,
    category: {
      name: 'competitionLevels', 
      categories: addAllCategory(CompetitionLevels), 
      selectedCategoryId: CategoryType.All, 
      fieldName: 'category',
      label: '@categories.listType.competitionLevel.all.categoryLabel'
    },
    initialQuery: []
  },  
  {
    id: ListType.DocumentAll,
    title: '@categories.listType.document.all.title',
    modelType: ModelType.Document,
    slug: 'document',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Category,
    category: { 
      name: 'documentType', 
      categories: addAllCategory(DocumentTypes), 
      selectedCategoryId: CategoryType.All, 
      fieldName: 'category',
      label: '@categories.listType.document.all.categoryLabel'
    },
    initialQuery: []
  },
  {
    id: ListType.InvoicePositionAll,
    title: '@categories.listType.invoicePosition.all.title',
    modelType: ModelType.InvoicePosition,
    slug: 'invoicePosition',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Category,
    category: { 
      name: 'invoicePositionType', 
      categories: addAllCategory(InvoicePositionTypes), 
      selectedCategoryId: CategoryType.All, 
      fieldName: 'category',
      label: '@categories.listType.invoicePosition.all.categoryLabel'
    },
    initialQuery: []
  },
  {
    id: ListType.MemberScsAll,
    title: '@categories.listType.member.scs.all.title',
    modelType: ModelType.Relationship,
    slug: 'membership',
    relationshipType: RelationshipType.Membership,
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Category,
    category: { 
      name: 'scsMemberType', 
      categories: addAllCategory(ScsMemberTypes), 
      selectedCategoryId: CategoryType.All, 
      fieldName: 'subType',
      label: '@categories.listType.member.scs.all.categoryLabel'
    },
    initialQuery: [
      { key: 'objectKey', operator: '==', value: OrgKey.SCS },
      { key: 'subjectType', operator: '==', value: ModelType.Person },
      { key: 'validTo', operator: '>=', value: getTodayStr(DateFormat.StoreDate)}
    ],
    orderBy: 'validTo',
  },
  {
    id: ListType.MemberScsActive,
    title: '@categories.listType.member.scs.active.title',
    modelType: ModelType.Relationship,
    relationshipType: RelationshipType.Membership,
    slug: 'membership',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Category,
    category: { 
      name: 'scsMemberType', 
      categories: addAllCategory(ScsActiveTypes), 
      selectedCategoryId: CategoryType.All, 
      fieldName: 'subType',
      label: '@categories.listType.member.scs.active.categoryLabel'
    },
    initialQuery: [
      { key: 'objectKey', operator: '==', value: OrgKey.SCS },
      { key: 'state', operator: '==', value: MembershipState.Active },
      { key: 'subjectType', operator: '==', value: ModelType.Person },
      { key: 'validTo', operator: '>=', value: getTodayStr(DateFormat.StoreDate)}
    ],
    orderBy: 'validTo',
  },
  {
    id: ListType.MemberScsPassive,
    title: '@categories.listType.member.scs.passive.title',
    modelType: ModelType.Relationship,
    relationshipType: RelationshipType.Membership,
    slug: 'membership',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.None,
    initialQuery: [
      { key: 'objectKey', operator: '==', value: OrgKey.SCS },
      { key: 'subType', operator: '==', value: ScsMemberType.Passiv },
      { key: 'subjectType', operator: '==', value: ModelType.Person },
      { key: 'validTo', operator: '>=', value: getTodayStr(DateFormat.StoreDate)}
    ],
    orderBy: 'validTo',
  },
  {
    id: ListType.MemberScsAlumni,
    title: '@categories.listType.member.scs.alumni.title',
    modelType: ModelType.Relationship,
    relationshipType: RelationshipType.Membership,
    slug: 'membership',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.None,
    initialQuery: [
      { key: 'objectKey', operator: '==', value: OrgKey.SCS },
      { key: 'subjectType', operator: '==', value: ModelType.Person },
      { key: 'validTo', operator: '<', value: getTodayStr(DateFormat.StoreDate)},
      { key: 'relIsLast', operator: '==', value: true}
    ],
    orderBy: 'validTo',
  },
  {
    id: ListType.MemberScsDeceased,
    title: '@categories.listType.member.scs.deceased.title',
    modelType: ModelType.Relationship,
    relationshipType: RelationshipType.Membership,
    slug: 'membership',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.None,
    initialQuery: [
      { key: 'objectKey', operator: '==', value: OrgKey.SCS },
      { key: 'subjectType', operator: '==', value: ModelType.Person },
      { key: 'validTo', operator: '<=', value: getTodayStr(DateFormat.StoreDate)},
      { key: 'relIsLast', operator: '==', value: true}
    ],
    orderBy: 'validTo',
  },
  {
    id: ListType.MemberScsEntries,
    title: '@categories.listType.member.scs.entries.title',
    modelType: ModelType.Relationship,
    relationshipType: RelationshipType.Membership,
    slug: 'membership',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Year,
    year: { 
      fieldName: 'validFrom',
      years: getYearList(),
      selectedYear: getYear(),
      label: '@categories.listType.member.scs.entries.yearLabel'
    },
    initialQuery: [
      { key: 'objectKey', operator: '==', value: OrgKey.SCS },
      { key: 'subjectType', operator: '==', value: ModelType.Person },
      { key: 'validFrom', operator: '<=', value: getYear() + '1231'},
      { key: 'priority', operator: '==', value: 1}
    ],
    orderBy: 'validFrom',
  },
  {
    id: ListType.MemberScsExits,
    title: '@categories.listType.member.scs.exits.title',
    modelType: ModelType.Relationship,
    relationshipType: RelationshipType.Membership,
    slug: 'membership',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Year,
    year: { 
      fieldName: 'validTo',
      years: getYearList(),
      selectedYear: getYear(),
      label: '@categories.listType.member.scs.exits.yearLabel'
    },
    initialQuery: [
      { key: 'objectKey', operator: '==', value: OrgKey.SCS },
      { key: 'subjectType', operator: '==', value: ModelType.Person },
      { key: 'validTo', operator: '<=', value: getYear() + '1231'},
      { key: 'relIsLast', operator: '==', value: true}
    ],
    orderBy: 'validTo',
  },
  {
    id: ListType.MemberScsMen,
    title: '@categories.listType.member.scs.men.title',
    modelType: ModelType.Relationship,
    relationshipType: RelationshipType.Membership,
    slug: 'membership',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Category,
    category: { 
      name: 'scsMemberType', 
      categories: addAllCategory(ScsMemberTypes), 
      selectedCategoryId: CategoryType.All, 
      fieldName: 'subjectCategory',
      label: '@categories.listType.member.scs.men.categoryLabel'
    },
    initialQuery: [
      { key: 'objectKey', operator: '==', value: OrgKey.SCS },
      { key: 'subjectType', operator: '==', value: ModelType.Person },
      { key: 'subjectCategory', operator: '==', value: GenderType.Male },
      { key: 'validTo', operator: '>=', value: getTodayStr(DateFormat.StoreDate)}
    ],
    orderBy: 'validTo',
  },
  {
    id: ListType.MemberScsWomen,
    title: '@categories.listType.member.scs.women.title',
    modelType: ModelType.Relationship,
    relationshipType: RelationshipType.Membership,
    slug: 'membership',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Category,
    category: { 
      name: 'scsMemberType', 
      categories: addAllCategory(ScsMemberTypes), 
      selectedCategoryId: CategoryType.All, 
      fieldName: 'subjectCategory',
      label: '@categories.listType.member.scs.women.categoryLabel'
    },
    initialQuery: [
      { key: 'objectKey', operator: '==', value: OrgKey.SCS },
      { key: 'subjectType', operator: '==', value: ModelType.Person },
      { key: 'subjectCategory', operator: '==', value: GenderType.Female },
      { key: 'validTo', operator: '>=', value: getTodayStr(DateFormat.StoreDate)}
    ],
    orderBy: 'validTo',
  },
  {
    id: ListType.MemberSrvAll,
    title: '@categories.listType.member.srv.all.title',
    modelType: ModelType.Relationship,
    relationshipType: RelationshipType.Membership,
    slug: 'membership',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Category,
    category: { 
      name: 'memberType', 
      categories: addAllCategory(MemberTypes), 
      selectedCategoryId: CategoryType.All, 
      fieldName: 'subType',
      label: '@categories.listType.member.srv.all.categoryLabel'
    },
    initialQuery: [
      { key: 'objectKey', operator: '==', value: OrgKey.SRV },
      { key: 'subjectType', operator: '==', value: ModelType.Person },
      { key: 'state', operator: '==', value: MembershipState.Active },
      { key: 'validTo', operator: '>=', value: getTodayStr(DateFormat.StoreDate)}
    ],
    orderBy: 'validTo',
  },
  {
    id: ListType.OwnershipAll,
    title: '@categories.listType.ownership.all.title',
    modelType: ModelType.Relationship,
    relationshipType: RelationshipType.Ownership,
    slug: 'ownership',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Category,
    category: { 
      name: 'resourceType', 
      categories: addAllCategory(ResourceTypes), 
      selectedCategoryId: CategoryType.All, 
      fieldName: 'objectCategory',
      label: '@categories.listType.ownership.all.categoryLabel'
    },
    initialQuery: [
      { key: 'validTo', operator: '>=', value: getTodayStr(DateFormat.StoreDate)}
    ],
    orderBy: 'validTo'
  },
  {
    id: ListType.OwnershipRowingBoats,
    title: '@categories.listType.ownership.boat.rowing.title',
    modelType: ModelType.Relationship,
    relationshipType: RelationshipType.Ownership,
    slug: 'ownership',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Category,
    category: { 
      name: 'boatType', 
      categories: addAllCategory(BoatTypes), 
      selectedCategoryId: CategoryType.All, 
      fieldName: 'objectCategory',
      label: '@categories.listType.ownership.boat.rowing.categoryLabel'
    },
    initialQuery: [
      { key: 'objectType', operator: '==', value: ModelType.Boat },
      { key: 'validTo', operator: '>=', value: getTodayStr(DateFormat.StoreDate)}
    ],
    orderBy: 'validTo'
  },
  {
    id: ListType.OwnershipClubBoats,
    title: '@categories.listType.ownership.boat.club.title',
    modelType: ModelType.Relationship,
    relationshipType: RelationshipType.Ownership,
    slug: 'ownership',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Category,
    category: { 
      name: 'boatType', 
      categories: addAllCategory(BoatTypes), 
      selectedCategoryId: CategoryType.All, 
      fieldName: 'objectCategory',
      label: '@categories.listType.ownership.boat.club.categoryLabel'
    },
    initialQuery: [
      { key: 'objectType', operator: '==', value: ModelType.Boat },
      { key: 'subjectType', operator: '==', value: ModelType.Org },
      { key: 'validTo', operator: '>=', value: getTodayStr(DateFormat.StoreDate)}
    ],
    orderBy: 'validTo'
  },
  {
    id: ListType.OwnershipPrivateBoats,
    title: '@categories.listType.ownership.boat.private.title',
    modelType: ModelType.Relationship,
    relationshipType: RelationshipType.Ownership,
    slug: 'ownership',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.None,
    initialQuery: [
      { key: 'objectType', operator: '==', value: ModelType.Boat },
      { key: 'subjectType', operator: '==', value: ModelType.Person },
      { key: 'validTo', operator: '>=', value: getTodayStr(DateFormat.StoreDate)}
    ],
    orderBy: 'validTo'
  },
  {
    id: ListType.OwnershipMaleLockers,
    title: '@categories.listType.ownership.lockers.male.title',
    modelType: ModelType.Relationship,
    relationshipType: RelationshipType.Ownership,
    slug: 'ownership',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.None,
    initialQuery: [
      { key: 'objectType', operator: '==', value: ModelType.Resource },
      { key: 'objectCategory', operator: '==', value: ResourceType.MaleLocker },
      { key: 'validTo', operator: '>=', value: getTodayStr(DateFormat.StoreDate)}
    ],
    orderBy: 'validTo',
  },
  {
    id: ListType.OwnershipFemaleLockers,
    title: '@categories.listType.ownership.lockers.female.title',
    modelType: ModelType.Relationship,
    relationshipType: RelationshipType.Ownership,
    slug: 'ownership',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.None,
    initialQuery: [
      { key: 'objectType', operator: '==', value: ModelType.Resource },
      { key: 'objectCategory', operator: '==', value: ResourceType.FemaleLocker },
      { key: 'validTo', operator: '>=', value: getTodayStr(DateFormat.StoreDate)}
    ],
    orderBy: 'validTo',
  },
  {
    id: ListType.OwnershipHouseKeys,
    title: '@categories.listType.ownership.houseKeys.title',
    modelType: ModelType.Relationship,
    relationshipType: RelationshipType.Ownership,
    slug: 'ownership',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.None,
    initialQuery: [
      { key: 'objectType', operator: '==', value: ModelType.Resource },
      { key: 'objectCategory', operator: '==', value: ResourceType.HouseKey },
      { key: 'validTo', operator: '>=', value: getTodayStr(DateFormat.StoreDate)}
    ],
    orderBy: 'validTo'
  },
  {
    id: ListType.PageAll,
    title: '@categories.listType.page.all.title',
    modelType: ModelType.Page,
    slug: 'page',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.None,
    initialQuery: [],
    orderBy: 'name'
  },
  {
    id: ListType.SectionAll,
    title: '@categories.listType.section.all.title',
    modelType: ModelType.Section,
    slug: 'section',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Category,
    category: { 
      name: 'sectionType', 
      categories: addAllCategory(SectionTypes), 
      selectedCategoryId: CategoryType.All, 
      fieldName: 'category',
      label: '@categories.listType.section.all.categoryLabel'
    },
    initialQuery: []
  },
  {
    id: ListType.ResourceAll,
    title: '@categories.listType.resource.all.title',
    modelType: ModelType.Resource,
    slug: 'resource',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Category,
    category: { 
      name: 'resourceType', 
      categories: addAllCategory(ResourceTypes), 
      selectedCategoryId: CategoryType.All, 
      fieldName: 'category',
      label: '@categories.listType.resource.all.categoryLabel'
    },
    initialQuery: []
  }, 
  {
    id: ListType.ResourceMaleLockers,
    title: '@categories.listType.resource.lockers.male.title',
    modelType: ModelType.Resource,
    slug: 'resource',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.None,
    type: ResourceType.MaleLocker,
    initialQuery: [
      { key: 'category', operator: '==', value: ResourceType.MaleLocker }
    ]
  },
  {
    id: ListType.ResourceFemaleLockers,
    title: '@categories.listType.resource.lockers.female.title',
    modelType: ModelType.Resource,
    slug: 'resource',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.None,
    type: ResourceType.FemaleLocker,
    initialQuery: [
      { key: 'category', operator: '==', value: ResourceType.FemaleLocker }
    ]
  },
  {
    id: ListType.ResourceHouseKeys,
    title: '@categories.listType.resource.houseKeys.title',
    modelType: ModelType.Resource,
    slug: 'resource',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.None,
    type: ResourceType.HouseKey,
    initialQuery: [
      { key: 'category', operator: '==', value: ResourceType.HouseKey }
    ]
  },
  {
    id: ListType.ResourceRowingBoats,
    title: '@categories.listType.resource.rowingBoats.title',
    modelType: ModelType.Boat,
    slug: 'boat',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Category,
    category: { 
      name: 'boatType', 
      categories: addAllCategory(BoatTypes), 
      selectedCategoryId: CategoryType.All, 
      fieldName: 'subType',
      label: '@categories.listType.resource.rowingBoats.categoryLabel'
    },
    type: ResourceType.RowingBoat,
    initialQuery: [
      { key: 'category', operator: '==', value: ResourceType.RowingBoat }
    ]
  },
  {
    id: ListType.RelnoteAll,
    title: '@categories.modelType.relnotes.label',
    modelType: ModelType.Relnote,
    slug: 'relnote',
    filterType: FilterType.None,
    initialQuery: [],
    orderBy: 'relDate',
    sortOrder: 'desc'
  },
  {
    id: ListType.MemberScsContacts,
    title: '@categories.listType.member.scs.contacts.title',
    modelType: ModelType.Relationship,
    relationshipType: RelationshipType.Membership,
    slug: 'membership',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Category,
    category: { 
      name: 'scsMemberType', 
      categories: addAllCategory(ScsActiveTypes), 
      selectedCategoryId: CategoryType.All, 
      fieldName: 'subType',
      label: '@categories.listType.member.scs.active.categoryLabel'
    },
    initialQuery: [
      { key: 'objectKey', operator: '==', value: OrgKey.SCS },
      { key: 'subjectType', operator: '==', value: ModelType.Person },
      { key: 'state', operator: '==', value: MembershipState.Active },
      { key: 'validTo', operator: '>=', value: getTodayStr(DateFormat.StoreDate)}
    ],
    orderBy: 'validTo',
  },
  {
    id: ListType.SubjectAll,
    title: '@categories.listType.subject.all.title',
    modelType: ModelType.Subject,
    slug: 'subject',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.None,
    initialQuery: []
  },
  {
    id: ListType.ReservationAll,
    title: '@categories.listType.reservation.all.title',
    modelType: ModelType.Relationship,
    relationshipType: RelationshipType.Reservation,
    slug: 'reservation',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Year,
    year: { 
      fieldName: 'validFrom',
      years: getYearList(),
      selectedYear: getYear(),
      label: '@categories.listType.reservation.yearLabel'
    },  
    initialQuery: [],
    orderBy: 'validFrom'
  },
  {
    id: ListType.ReservationBoatHouse,
    title: '@categories.listType.reservation.boatHouse.title',
    modelType: ModelType.Relationship,
    relationshipType: RelationshipType.Reservation,
    slug: 'reservation',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Year,
    year: { 
      fieldName: 'validFrom',
      years: getYearList(),
      selectedYear: getYear(),
      label: '@categories.listType.reservation.yearLabel'
    },  
    initialQuery: [
      { key: 'objectKey', operator: '==', value: 'mYhzitO5P0mDrKrThNdD' }
    ],
    orderBy: 'validFrom'
  },
  {
    id: ListType.EventAll,
    title: '@categories.listType.event.all.title',
    modelType: ModelType.Event,
    slug: 'event',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.None,
    year: { 
      fieldName: 'startDate',
      years: getYearList(),
      selectedYear: getYear(),
      label: '@categories.listType.event.yearLabel'
    },  
    initialQuery: [],
    orderBy: 'startDate'
  },
  {
    id: ListType.LocationAll,
    title: '@categories.listType.location.all.title',
    modelType: ModelType.Location,
    slug: 'location',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Category,
    category: { 
      name: 'locationType', 
      categories: addAllCategory(LocationTypes), 
      selectedCategoryId: CategoryType.All, 
      fieldName: 'category',
      label: '@categories.listType.location.categoryLabel'
    },
    initialQuery: [],
    orderBy: 'name'
  },
  {
    id: ListType.MenuItemAll,
    title: '@categories.listType.menuItem.all.title',
    modelType: ModelType.MenuItem,
    slug: 'menuItem',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Category,
    category: { 
      name: 'menuAction', 
      categories: addAllCategory(MenuActions), 
      selectedCategoryId: CategoryType.All, 
      fieldName: 'category',
      label: '@categories.listType.menuItem.all.categoryLabel'
    },
    initialQuery: [],
    orderBy: 'name'
  },
  {
    id: ListType.TaskAll,
    title: '@categories.listType.task.all.title',
    modelType: ModelType.Task,
    slug: 'task',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Category,
    category: { 
      name: 'taskState', 
      categories: addAllCategory(TaskStates), 
      selectedCategoryId: TaskState.Doing, 
      fieldName: 'category',
      label: '@categories.listType.task.categoryLabel'
    },
    initialQuery: [],
    orderBy: 'dueDate'
  },
  {
    id: ListType.TripAll,
    title: '@categories.listType.trip.all.title',
    modelType: ModelType.Trip,
    slug: 'trip',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.Year,
    year: { 
      fieldName: 'startDateTime',
      years: getYearList(),
      selectedYear: getYear(),
      label: '@categories.listType.trip.yearLabel'
    },
    initialQuery: [],
    orderBy: 'startDateTime',
  },
  {
    id: ListType.EventYearly,
    title: '@categories.listType.event.yearly.title',
    modelType: ModelType.Event,
    slug: 'event',
    search: { fieldName: 'index', placeholder: '@general.operation.search.placeholder' },
    filterType: FilterType.None,
    initialQuery: [],
    orderBy: 'startDate'
  }
];


export function getOrgId(listType: ListType): string {
  return listType === ListType.MemberSrvAll ? OrgKey.SRV : OrgKey.SCS;
}
