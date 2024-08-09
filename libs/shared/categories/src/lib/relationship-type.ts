import { Category } from './category-model';
import { CollectionNames } from "@bk/util";
import { getCategoryStringField } from './category.util';

export interface RelationshipTypeCategory extends Category {
  // use name instead of slug, i.e. for the detail route
  collectionName: string; // name of the database collection
  route: string; // route of relationship list
}

/*
    Ownership:          Person|Org      owns|ownedBy            Resource
    Employment:         Person          worksFor|employs        Org         (Berufsfunktion, Arbeitsverhältnis, Vereinsfunktion etc.)
    Personal:           Person          PersonalRelType         Person    (Freundschaft, Feindschaft, Verwandtschaft, Partnerschaft etc.)
    Membership:         Person|Org      isMemberOf/hasMember    Org
    OwnershipTransfer:  Person|Org      buysFrom|sellsTo        Person|Org  (Kauf, Verkauf, Schenkung, Erbschaft, Miete etc.)
    Reservation:        Person|Org      reserves|isReservedFor  Resource  (Reservierung, Buchung, Anmeldung etc.); Warteliste wird über RelationshipState.Applied gelöst
 */
export enum RelationshipType {
    Ownership,
    Employment,
    Personal,
    Membership,
    OwnershipTransfer,
    Reservation
}

/*
add later:
- Rent/Lease            Person|Org    rents       Resource
- Usage                 Person|Org    uses        Resource
- Contract              Person|Org    contracts   Person|Org  (Vertrag, Vereinbarung, Abkommen etc.), url = link auf Vertrag
- Friendship            Person        likes       Person|Org (-> Personal ?)
- Incompatibility       Person        dislikes    Person|Org|Resource (-> Personal ?)
- Cooperation:          Person|Org    worksWith   Person|Org (-> Employment ?)
- Hierarchy             Person|Org    reportsTo   Person|Org (graph visualization)
- Custom (with label)   Person|Org    label       Person|Org|Resource
*/

// the name of the relationship, it is also used as the route to the detail page
export function getSlugFromRelationshipType(relationshipType: RelationshipType): string {
  return getCategoryStringField(RelationshipTypes, relationshipType, 'name');
}

// the name of the database collection
export function getCollectionNameFromRelationshipType(relationshipType: RelationshipType): CollectionNames {
  return getCategoryStringField(RelationshipTypes, relationshipType, 'collectionName') as CollectionNames;
}

// the route to the relationship list
export function getRelationshipRoute(relationshipType: RelationshipType): string {
  return getCategoryStringField(RelationshipTypes, relationshipType, 'route');
}

export const RelationshipTypes: RelationshipTypeCategory[] = [
    {
        id: RelationshipType.Ownership,
        abbreviation: 'OWN',
        name: 'ownership',
        i18nBase: 'relationship.type.ownership',
        icon: 'briefcase-outline',
        collectionName: CollectionNames.Ownership,
        route: 'ownerships',
    },
    {
        id: RelationshipType.Employment,
        abbreviation: 'EMP',
        name: 'employment',
        i18nBase: 'relationship.type.employment',
        icon: 'briefcase-outline',
        collectionName: CollectionNames.Employment,
        route: 'employments',
    },
    {
        id: RelationshipType.Personal,
        abbreviation: 'PERS',
        name: 'personal',
        i18nBase: 'relationship.type.personal',
        icon: 'finger-print-outline',
        collectionName: CollectionNames.Personal,
        route: 'personalRelationships',
    },
    {
        id: RelationshipType.Membership,
        abbreviation: 'MMBR',
        name: 'membership',
        i18nBase: 'relationship.type.membership',
        icon: 'people-circle-outline',
        collectionName: CollectionNames.Membership,
        route: 'memberships',
    },
    {
        id: RelationshipType.OwnershipTransfer,
        abbreviation: 'OSHP',
        name: 'ownershipTransfer',
        i18nBase: 'relationship.type.ownershipTransfer',
        icon: 'arrow-forward-outline',
        collectionName: CollectionNames.OwnershipTransfer,
        route: 'ownershipTransfers',
    },
    {
        id: RelationshipType.Reservation,
        abbreviation: 'RES',
        name: 'reservation',
        i18nBase: 'relationship.type.reservation',
        icon: 'calendar-outline',
        collectionName: CollectionNames.Reservation,
        route: 'reservations',
    }

]
