// src/pages/FormPreview.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getFormById } from '../services/formservice';
import { FormSchema, FormField } from '../types';
import { validateField } from '../utils/validation';
import { differenceInYears } from 'date-fns';
import {
  Button, TextField, FormControl, FormLabel, FormHelperText, Typography, Paper, Box,
  Select, MenuItem, RadioGroup, FormControlLabel, Radio, Checkbox
} from '@mui/material';

const FormPreview: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateDerivedFields = useCallback((values: Record<string, any>, fields: FormField[]) => {
    const newValues = { ...values };
    fields.forEach(field => {
        if(field.isDerived && field.derivationLogic === 'ageFromDOB' && field.derivedFrom?.[0]) {
            const dob = newValues[field.derivedFrom[0]];
            if(dob) {
                try {
                    newValues[field.id] = differenceInYears(new Date(), new Date(dob));
                } catch {
                    newValues[field.id] = 'Invalid Date';
                }
            } else {
                newValues[field.id] = '';
            }
        }
    });
    return newValues;
  }, []);

  useEffect(() => {
    if (formId) {
      const formSchema = getFormById(formId);
      if (formSchema) {
        setSchema(formSchema);
        let initialValues: Record<string, any> = {};
        formSchema.fields.forEach(field => {
          initialValues[field.id] = field.type === 'checkbox' ? (field.defaultValue || false) : (field.defaultValue ?? '');
        });
        // Initial calculation of derived fields
        setFormValues(calculateDerivedFields(initialValues, formSchema.fields));
      }
    }
  }, [formId, calculateDerivedFields]);

  const handleChange = (id: string, value: any) => {
    setFormValues(prevValues => {
      const newValues = { ...prevValues, [id]: value };
      return calculateDerivedFields(newValues, schema?.fields || []);
    });
    
    const field = schema?.fields.find(f => f.id === id);
    if (field) {
      const error = validateField(field, value);
      setErrors(prevErrors => ({ ...prevErrors, [id]: error }));
    }
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    handleChange(id, checked);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors: Record<string, string> = {};
    schema?.fields.forEach(field => {
        const error = validateField(field, formValues[field.id]);
        if (error) {
          valid = false;
          newErrors[field.id] = error;
        }
    });
    setErrors(newErrors);
    if (valid) {
      alert('Form Submitted Successfully!\n' + JSON.stringify(formValues, null, 2));
    } else {
      alert('Please fix the validation errors before submitting.');
    }
  };
  
  if (!schema) return <Typography>Form not found or is loading...</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>{schema.name}</Typography>
      <form onSubmit={handleSubmit}>
        {schema.fields.map(field => (
          <Box key={field.id} sx={{ mb: 3 }}>
            <FormControl fullWidth error={!!errors[field.id]}>
              <FormLabel component="legend" sx={{ mb: 1 }}>{field.label}{field.validations.required ? ' *' : ''}</FormLabel>
              {(() => {
                switch (field.type) {
                  case 'text':
                  case 'number':
                  case 'date':
                    return <TextField type={field.type} value={formValues[field.id] || ''} onChange={e => handleChange(field.id, e.target.value)} variant="outlined" error={!!errors[field.id]} InputLabelProps={field.type === 'date' ? { shrink: true } : {}}/>;
                  case 'textarea':
                    return <TextField multiline rows={4} value={formValues[field.id] || ''} onChange={e => handleChange(field.id, e.target.value)} variant="outlined" error={!!errors[field.id]} />;
                  case 'select':
                    return (<Select value={formValues[field.id] || ''} onChange={e => handleChange(field.id, e.target.value)} displayEmpty>
                              <MenuItem value=""><em>-- Please select --</em></MenuItem>
                              {field.options?.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                            </Select>);
                  case 'radio':
                    return (<RadioGroup value={formValues[field.id] || ''} onChange={e => handleChange(field.id, e.target.value)}>
                              {field.options?.map(opt => <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt}/>)}
                            </RadioGroup>);
                  case 'checkbox':
                    return <FormControlLabel control={<Checkbox checked={!!formValues[field.id]} onChange={e => handleCheckboxChange(field.id, e.target.checked)}/>} label={field.label}/>;
                  case 'derived':
                     return <TextField value={formValues[field.id] || ''} disabled variant="outlined" />;
                  default:
                    return null;
                }
              })()}
              {errors[field.id] && <FormHelperText>{errors[field.id]}</FormHelperText>}
            </FormControl>
          </Box>
        ))}
        <Button type="submit" variant="contained" color="primary">Submit</Button>
      </form>
    </Paper>
  );
};

export default FormPreview;