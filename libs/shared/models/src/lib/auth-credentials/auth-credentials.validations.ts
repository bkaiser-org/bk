import { only, staticSuite } from "vest";
import { AuthCredentials } from "./auth-credentials.model";
import { EMAIL_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@bk/util";
import { stringValidations } from "../primitive-validations/string.validations";

export const authCredentialsValidations = staticSuite((model: AuthCredentials, field?: string) => {
  if (field) only(field);

  stringValidations('email', model.email, EMAIL_LENGTH);
  stringValidations('password', model.password, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH);
});