import { ModelType, RelationshipType } from '@bk/categories';
import { AdminRole } from '@bk/models';

export function getModelAdmin(modelType: ModelType): AdminRole[] {
  switch(modelType) {
    case ModelType.Person:
    case ModelType.Address:
    case ModelType.Subject:
    case ModelType.Application:    
    case ModelType.CompetitionLevel:
    case ModelType.Org:  return ['memberAdmin', 'admin'];
    case ModelType.Boat:
    case ModelType.Locker:
    case ModelType.HouseKey:    
    case ModelType.Resource: return ['resourceAdmin', 'admin'];
    case ModelType.Page:
    case ModelType.Section: 
    case ModelType.Document: 
    case ModelType.Event: return ['contentAdmin', 'admin'];
    case ModelType.InvoicePosition: return ['treasurer', 'admin'];
    case ModelType.Comment: return ['memberAdmin', 'resourceAdmin', 'contentAdmin', 'treasurer', 'admin'];
    case ModelType.Group:
    case ModelType.Location:
    case ModelType.Relnote:
    case ModelType.User:
    case ModelType.Relationship: 
    default: return ['admin'];
  }
}

export function getRelationshipAdmin(relType: RelationshipType): AdminRole[] {
  switch(relType) {
    case RelationshipType.Membership: return ['memberAdmin', 'admin'];
    case RelationshipType.Ownership: return ['resourceAdmin', 'admin'];
    default: return ['admin'];
  }
}