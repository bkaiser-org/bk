import { Category } from './category-model';
import { CollectionNames } from '@bk/util';
import { getCategoryStringField } from './category.util';

export interface ModelTypeCategory extends Category {
    // use name instead of slug, i.e. for the detail route
    collectionName: string; // name of the database collection
}

export enum ModelType {
    Person,
    User,
    Org,
    Boat,
    Resource,
    Group,
    Event,
    Address,
    Document,
    Locker,
    HouseKey,
    Location,
    Subject,
    Relnote,
    Comment,
    Relationship,
    Application,
    Page,
    Section,
    CompetitionLevel,
    InvoicePosition,
    MembershipSubject,
    Menu,
    MenuItem,
    Task,
    Trip
}

export const DefaultModelType = ModelType.Subject;

// the name of the model, it is also used as the route to the detail page
export function getModelSlug(modelType: ModelType): string {
  return getCategoryStringField(ModelTypes, modelType, 'name');
}

// the name of the database collection
export function getCollectionNameFromModelType(modelType: ModelType): CollectionNames {
  return getCategoryStringField(ModelTypes, modelType, 'collectionName') as CollectionNames;
}

export const ModelTypes: ModelTypeCategory[] = [
    {
        id: ModelType.Person,
        abbreviation: 'PERS',
        name: 'person',
        i18nBase: 'categories.modelType.person',
        icon: 'person-outline',
        collectionName: CollectionNames.Person,
    },
    {
        id: ModelType.User,
        abbreviation: 'USER',
        name: 'user',
        i18nBase: 'categories.modelType.user',
        collectionName: CollectionNames.User,
        icon: 'person-circle-outline'
    },
    {
        id: ModelType.Org,
        abbreviation: 'ORG',
        name: 'org',
        i18nBase: 'categories.modelType.org',
        collectionName: CollectionNames.Org,
        icon: 'business-outline'
    },
    {
        id: ModelType.Boat,
        abbreviation: 'BOAT',
        name: 'boat',
        i18nBase: 'categories.modelType.boat',
        collectionName: CollectionNames.Boat,
        icon: 'boat-outline'
    },
    {
        id: ModelType.Resource,
        abbreviation: 'RES',
        name: 'resource',
        i18nBase: 'categories.modelType.resource',
        collectionName: CollectionNames.Resource,
        icon: 'build-outline'
    },
    {
        id: ModelType.Group,
        abbreviation: 'GRP',
        name: 'group',
        i18nBase: 'categories.modelType.group',
        collectionName: CollectionNames.Group,
        icon: 'people-outline'
    },
    {
        id: ModelType.Event,
        abbreviation: 'EVT',
        name: 'event',
        i18nBase: 'categories.modelType.event',
        collectionName: CollectionNames.Event,
        icon: 'calendar-number-outline'
    },
    {
        id: ModelType.Address,
        abbreviation: 'ADDR',
        name: 'address',
        i18nBase: 'categories.modelType.address',
        collectionName: CollectionNames.Address,
        icon: 'location-outline'
    },
    {
        id: ModelType.Document,
        abbreviation: 'DOC',
        name: 'document',
        i18nBase: 'categories.modelType.document',
        collectionName: CollectionNames.Document,
        icon: 'document-outline'
    },
    {
        id: ModelType.Locker,
        abbreviation: 'LKR',
        name: 'locker',
        i18nBase: 'categories.modelType.locker',
        collectionName: CollectionNames.Locker,
        icon: 'lock-closed-outline'
    },
    {
        id: ModelType.HouseKey,
        abbreviation: 'KEY',
        name: 'key',
        i18nBase: 'categories.modelType.key',
        collectionName: CollectionNames.HouseKey,
        icon: 'key-outline'
    },
    {
        id: ModelType.Location,
        abbreviation: 'LOC',
        name: 'location',
        i18nBase: 'categories.modelType.location',
        collectionName: CollectionNames.Location,
        icon: 'location-outline'
    },
    {
        id: ModelType.Subject,
        abbreviation: 'SUBJ',
        name: 'subject',
        i18nBase: 'categories.modelType.subject',
        collectionName: CollectionNames.Subject,
        icon: 'person-outline'
    },
    {
        id: ModelType.Relnote,
        abbreviation: 'REL',
        name: 'relnote',
        i18nBase: 'categories.modelType.relnote',
        collectionName: CollectionNames.Relnote,
        icon: 'document-text-outline'
    },
    {
        id: ModelType.Comment,
        abbreviation: 'CMT',
        name: 'comment',
        i18nBase: 'categories.modelType.comment',
        collectionName: CollectionNames.Comment,
        icon: 'chatbubbles-outline'
    },
    {
        id: ModelType.Relationship,
        abbreviation: 'REL',
        name: 'relationship',
        i18nBase: 'categories.modelType.relationship',
        collectionName: CollectionNames.Relationship,
        icon: 'git-merge-outline'
    },
    {
        id: ModelType.Application,
        abbreviation: 'APPL',
        name: 'application',
        i18nBase: 'categories.modelType.application',
        collectionName: CollectionNames.Application,
        icon: 'apps-outline'
    },
    {
        id: ModelType.Page,
        abbreviation: 'PAGE',
        name: 'page',
        i18nBase: 'categories.modelType.page',
        collectionName: CollectionNames.Page,
        icon: 'reader-outline'
    },
    {
      id: ModelType.Section,
      abbreviation: 'SECT',
      name: 'section',
      i18nBase: 'categories.modelType.section',
      collectionName: CollectionNames.Section,
      icon: 'reorder-two-outline'
  },
  {
    id: ModelType.CompetitionLevel,
    abbreviation: 'CLEVEL',
    name: 'competitionLevel',
    i18nBase: 'categories.modelType.competitionLevel',
    collectionName: CollectionNames.CompetitionLevel,
    icon: 'podium-outline'
},
{
  id: ModelType.InvoicePosition,
  abbreviation: 'INVP',
  name: 'invoicePosition',
  i18nBase: 'categories.modelType.invoicePosition',
  collectionName: CollectionNames.InvoicePosition,
  icon: 'cash-outline'
},
{
  id: ModelType.MembershipSubject,
  abbreviation: 'MS',
  name: 'membershipSubject',
  i18nBase: 'categories.modelType.membershipSubject',
  collectionName: '',
  icon: 'git-merge-outline'
},
{
  id: ModelType.Task,
  abbreviation: 'TASK',
  name: 'task',
  i18nBase: 'categories.modelType.task',
  collectionName: CollectionNames.Task,
  icon: 'hammer-outline'
},
{
  id: ModelType.Trip,
  abbreviation: 'TRIP',
  name: 'trip',
  i18nBase: 'categories.modelType.trip',
  collectionName:  CollectionNames.Trip,
  icon: 'airplane-outline'
}
];



