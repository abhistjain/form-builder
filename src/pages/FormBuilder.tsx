// src/pages/FormBuilder.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, TextField, Select, MenuItem, IconButton, FormControlLabel, Checkbox,
  Paper, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle, Divider
} from '@mui/material';
import { AddCircleOutline, Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { saveForm } from '../services/formservice';
import { FormField, FormSchema } from '../types';

const FormBuilder: React.FC = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [formName, setFormName] = useState('');
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const navigate = useNavigate();

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      label: `New ${type} field`,
      type,
      validations: {},
      ...( (type === 'select' || type === 'radio') && { options: ['Option 1', 'Option 2'] }),
      ...(type === 'derived' && { isDerived: true, derivationLogic: 'ageFromDOB', derivedFrom: [] }),
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, newProps: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...newProps } : f));
  };

  const updateFieldValidation = (id: string, validationProps: Partial<FormField['validations']>) => {
    const field = fields.find(f => f.id === id);
    if(field) {
        updateField(id, { validations: { ...field.validations, ...validationProps }});
    }
  };

  const removeField = (id: string) => setFields(fields.filter(f => f.id !== id));

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
    setFields(newFields);
  };

  const handleSave = () => {
    if (!formName.trim()) { alert('Please enter a form name.'); return; }
    const newForm: FormSchema = {
      id: `form_${Date.now()}`,
      name: formName,
      createdAt: new Date().toISOString(),
      fields,
    };
    saveForm(newForm);
    setOpenSaveDialog(false);
    navigate('/myforms');
  };
  
  const dateFields = fields.filter(f => f.type === 'date').map(f => ({ id: f.id, label: f.label }));

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Form Builder</Typography>

      {/* Field Configuration Sections */}
      {fields.map((field, index) => (
        <Paper key={field.id} sx={{ p: 2, mb: 2, border: '1px solid #ddd' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>{field.label} ({field.type})</Typography>
            <IconButton onClick={() => moveField(index, 'up')} disabled={index === 0}><ArrowUpward /></IconButton>
            <IconButton onClick={() => moveField(index, 'down')} disabled={index === fields.length - 1}><ArrowDownward /></IconButton>
            <IconButton onClick={() => removeField(field.id)} color="error"><Delete /></IconButton>
          </Box>
          <Divider sx={{ my: 1 }}/>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <TextField size="small" label="Field Label" value={field.label} onChange={(e) => updateField(field.id, { label: e.target.value })}/>
            {field.type !== 'checkbox' && field.type !== 'derived' && <TextField size="small" label="Default Value" defaultValue={field.defaultValue || ''} onBlur={(e) => updateField(field.id, { defaultValue: e.target.value })}/>}
          </Box>

          {/* Validation Rules */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Validation Rules</Typography>
            <FormControlLabel control={<Checkbox checked={field.validations.required || false} onChange={e => updateFieldValidation(field.id, { required: e.target.checked })}/>} label="Required"/>
            {(field.type === 'text') && <FormControlLabel control={<Checkbox checked={field.validations.isEmail || false} onChange={e => updateFieldValidation(field.id, { isEmail: e.target.checked })}/>} label="Email Format"/>}
            {(field.type === 'text') && <FormControlLabel control={<Checkbox checked={field.validations.isPassword || false} onChange={e => updateFieldValidation(field.id, { isPassword: e.target.checked })}/>} label="Password Rule"/>}
            {(field.type === 'text' || field.type === 'textarea') && <>
                <TextField sx={{width: 120, ml: 2}} size="small" type="number" label="Min Length" defaultValue={field.validations.minLength} onBlur={e => updateFieldValidation(field.id, { minLength: e.target.value ? parseInt(e.target.value) : undefined })}/>
                <TextField sx={{width: 120, ml: 2}} size="small" type="number" label="Max Length" defaultValue={field.validations.maxLength} onBlur={e => updateFieldValidation(field.id, { maxLength: e.target.value ? parseInt(e.target.value) : undefined })}/>
            </>}
          </Box>
          
          {/* Field-specific configurations */}
          {field.isDerived && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Derived Logic: Age from Date of Birth</Typography>
              <Select size="small" value={field.derivedFrom?.[0] || ''} onChange={e => updateField(field.id, { derivedFrom: [e.target.value] })} displayEmpty>
                  <MenuItem value=""><em>Select Parent Date Field</em></MenuItem>
                  {dateFields.map(df => <MenuItem key={df.id} value={df.id}>{df.label}</MenuItem>)}
              </Select>
            </Box>
          )}
          {(field.type === 'select' || field.type === 'radio') && (
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Options (one per line)</Typography>
                <TextField multiline rows={3} fullWidth variant="outlined" defaultValue={field.options?.join('\n')} onBlur={(e) => updateField(field.id, { options: e.target.value.split('\n').filter(opt => opt.trim() !== '') })} />
            </Box>
          )}

        </Paper>
      ))}

      {/* Add Field Buttons */}
      <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button startIcon={<AddCircleOutline />} onClick={() => addField('text')}>Text</Button>
        <Button startIcon={<AddCircleOutline />} onClick={() => addField('number')}>Number</Button>
        <Button startIcon={<AddCircleOutline />} onClick={() => addField('textarea')}>Textarea</Button>
        <Button startIcon={<AddCircleOutline />} onClick={() => addField('date')}>Date</Button>
        <Button startIcon={<AddCircleOutline />} onClick={() => addField('select')}>Select</Button>
        <Button startIcon={<AddCircleOutline />} onClick={() => addField('radio')}>Radio</Button>
        <Button startIcon={<AddCircleOutline />} onClick={() => addField('checkbox')}>Checkbox</Button>
        <Button startIcon={<AddCircleOutline />} onClick={() => addField('derived')}>Derived (Age)</Button>
      </Box>

      <Divider sx={{ my: 3 }} />
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setOpenSaveDialog(true)} disabled={fields.length === 0}>
        Save Form
      </Button>

      {/* Save Dialog */}
      <Dialog open={openSaveDialog} onClose={() => setOpenSaveDialog(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent><TextField autoFocus margin="dense" label="Form Name" type="text" fullWidth variant="standard" value={formName} onChange={(e) => setFormName(e.target.value)}/></DialogContent>
        <DialogActions><Button onClick={() => setOpenSaveDialog(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></DialogActions>
      </Dialog>
    </Paper>
  );
};

export default FormBuilder;