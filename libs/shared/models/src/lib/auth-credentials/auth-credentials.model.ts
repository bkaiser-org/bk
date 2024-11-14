import { DeepRequired } from "ngx-vest-forms";

export type AuthCredentials = Partial<{
  email: string;
  password: string;
}>;

export const authCredentialsShape: DeepRequired<AuthCredentials> = {
  email: '',
  password: ''
};