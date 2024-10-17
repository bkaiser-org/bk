import { DeepPartial, DeepRequired } from 'ngx-vest-forms';

export type PageFormModel = DeepPartial<{
    bkey: string,
    name: string,
    tags: string,
    notes: string,
    sections: string[],
    tenant: string[]
}>;

export const pageFormModelShape: DeepRequired<PageFormModel> = {
    bkey: '',
    name: '',
    tags: '',
    notes: '',
    sections: [],
    tenant: []
};