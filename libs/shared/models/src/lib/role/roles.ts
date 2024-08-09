/**
 * Role-based Authorization
 * see https://fireship.io/lessons/role-based-authorization-with-firestore-nosql-and-angular-5/
 */
export interface Roles {
    anonymous?: boolean,
    registered?: boolean,
    privileged?: boolean,
    contentAdmin?: boolean,
    resourceAdmin?: boolean,
    eventAdmin?: boolean,
    memberAdmin?: boolean,
    treasurer?: boolean,
    admin?: boolean
}

export type RoleName = 'none' | 'anonymous' | 'registered' | 'privileged' | 'contentAdmin' | 'resourceAdmin' | 'memberAdmin' | 'eventAdmin' | 'treasurer' | 'admin';
export type AdminRole = 'contentAdmin' | 'resourceAdmin' | 'memberAdmin' | 'eventAdmin' | 'treasurer' | 'admin';
export type RoleLevel = 'anonymous' | 'registered' | 'privileged' | 'admin';

