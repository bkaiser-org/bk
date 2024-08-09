export function getCheckboxIcon(checkboxValue: boolean): string {
    return (checkboxValue ? 'checkbox-outline' : 'square-outline');
}

export interface ValidationInfo {
  type: string,
  message: string
};

export interface ValidationInfoDictionary {
  username: ValidationInfo[],
  mandatoryName: ValidationInfo[],
  name: ValidationInfo[],
  email: ValidationInfo[],
  phone: ValidationInfo[],
  password: ValidationInfo[],
  confirm_password: ValidationInfo[],
  matching_passwords: ValidationInfo[],
  terms: ValidationInfo[],
}

