import { ColorIonic, RoleEnum } from "@bk/categories";
import { SectionProperties } from "./section.model";
import { DeepPartial, DeepRequired } from 'ngx-vest-forms';

export type SectionFormModel = DeepPartial<{
    bkey: string,
    name: string,
    type: number,
    url: string,
    imagePosition: number,
    colSize: number,
    content: string,
    tags: string,
    color: ColorIonic,
    notes: string,
    roleNeeded: RoleEnum,
    properties: SectionProperties
}>;

export const sectionFormModelShape: DeepRequired<SectionFormModel> = {
    bkey: '',
    name: '',
    type: -1,
    url: '',
    imagePosition: -1,
    colSize: -1,
    content: '',
    tags: '',
    color: ColorIonic.White,
    notes: '',
    roleNeeded: RoleEnum.Admin,
    properties: {}
};