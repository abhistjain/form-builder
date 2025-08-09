import { FormSchema } from '../types';

const FORMS_KEY = 'dynamic_forms';

export const getForms = (): FormSchema[] => {
  const formsJson = localStorage.getItem(FORMS_KEY);
  return formsJson ? JSON.parse(formsJson) : [];
};

export const getFormById = (formId: string): FormSchema | undefined => {
  const forms = getForms();
  return forms.find(form => form.id === formId);
};

export const saveForm = (schema: FormSchema): void => {
  const forms = getForms();
  const existingIndex = forms.findIndex(form => form.id === schema.id);

  if (existingIndex > -1) {
    forms[existingIndex] = schema;
  } else {
    forms.push(schema);
  }

  localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
};