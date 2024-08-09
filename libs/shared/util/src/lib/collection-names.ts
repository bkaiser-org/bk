/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
/* we need this exception because we want to give some firestore collections several names */

export enum CollectionNames {
    Person = 'subjects2',
    User = 'users3',
    Org = 'subjects2',
    Boat = 'resources6',
    Resource = 'resources6',
    Group = 'subjects2',
    Event = 'calevents',
    Address = 'addresses',
    Document = 'docs3',
    Locker = 'resources6',
    HouseKey = 'resources6',
    Location = 'locations',
    Subject = 'subjects2',
    Relnote = 'relnotes2',
    Comment = 'comments',
    Relationship = 'relationships',
    Application = 'applications',
    Ownership = 'ownerships2',
    Employment = 'employments',
    Personal = 'personal',
    Membership = 'memberships3',
    OwnershipTransfer = 'ownershiptransfers',
    Reservation = 'reservations',
    Page = 'pages2',
    Section = 'sections3',
    CompetitionLevel = 'competitionLevels2',
    Statistics = 'statistics2',
    SwissCities = 'swissCities2',
    InvoicePosition = 'invoicepositions2',
    MemberStatistics = 'memberStatistics2',
    Avatar = 'avatars',
    Menu = 'menus',
    MenuItems = 'menuItems',
    Task = 'tasks',
    Trip = 'trips',
}

/*

BEWARE: not all collections do exist
-> events2, shipments, lockers (in resources), housekeys (in resources), 
locations, deliveries, delivery-items, delivery-positions, relationships

BEWARE: some collections are subcollections:
-> addresses, comments

BEWARE: collectionName is not the same as the route:
boats3 -> boats
resources3 -> resources
activities2 -> activities
groups2 -> groups
events2 -> event
docs2 -> docs
roles2 -> roles
*/