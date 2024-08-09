import { CategoryType, ModelType, RelationshipType } from "@bk/categories";

export const AVATAR_DIR = 'avatar';

export interface AvatarModel {
  bkey: string,   // key of the avatar
  tenant: string,
  modelType: ModelType,
  relationshipType: RelationshipType | CategoryType.Undefined,
  mkey: string,     // key of the model the avatar is related to
  baseName: string,
  extension: string,
  storagePath: string
}

