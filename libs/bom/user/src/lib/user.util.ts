import { UserModel } from '@bk/models';

/*------------------------------index ---------------------------*/
export function getUserIndex(model: UserModel): string {
    return `l:${model.loginEmail} p:${model.personKey}`;
}

export function getUserIndexInfo(): string {
    return 'l:loginEmail p:personKey';
}

