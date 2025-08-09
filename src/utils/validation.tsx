import { FormField } from '../types';

export const validateField = (field: FormField, value: any): string => {
  if (field.isDerived) return ''; 

  const checkIsValueEmpty = (val: any) => {
    if (val === null || val === undefined) return true;
    if (typeof val === 'string' && val.trim() === '') return true;
    if (Array.isArray(val) && val.length === 0) return true;
    return false;
  };

  if (field.validations.required && checkIsValueEmpty(value)) {
    return `${field.label} is required.`;
  }

  const stringValue = String(value || '');

  if (field.type === 'text' || field.type === 'textarea') {
    if (field.validations.minLength && stringValue.length < field.validations.minLength) {
      return `${field.label} must be at least ${field.validations.minLength} characters.`;
    }
    if (field.validations.maxLength && stringValue.length > field.validations.maxLength) {
      return `${field.label} must be no more than ${field.validations.maxLength} characters.`;
    }
  }

  if (field.validations.isEmail && stringValue && !/\S+@\S+\.\S+/.test(stringValue)) {
    return 'Please enter a valid email address.';
  }

  if (field.validations.isPassword && stringValue) {
    if (stringValue.length < 8) return 'Password must be at least 8 characters long.';
    if (!/\d/.test(stringValue)) return 'Password must contain at least one number.';
  }

  return ''; // No error
};