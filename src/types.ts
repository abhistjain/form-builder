export interface FormFieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  isEmail?: boolean;
  isPassword?: boolean;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'derived';
  defaultValue?: string | number | boolean;
  options?: string[]; // For select, radio
  validations: FormFieldValidation;
  // For derived fields
  isDerived?: boolean;
  derivedFrom?: string[]; // IDs of parent fields
  derivationLogic?: 'ageFromDOB'; // Example logic
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string;
  fields: FormField[];
}