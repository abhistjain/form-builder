import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemButton , Button, Typography, Paper } from '@mui/material';
import { getForms } from '../services/formservice';
import { FormSchema } from '../types';

const MyForms: React.FC = () => {
  const [forms, setForms] = useState<FormSchema[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setForms(getForms());
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Saved Forms
      </Typography>
      {forms.length === 0 ? (
        <Typography>No forms saved yet.</Typography>
      ) : (
        <List>
          {forms.map((form) => (
            <ListItem key={form.id} divider disablePadding>
                <ListItemButton component={RouterLink} to={`/preview/${form.id}`}>
                    <ListItemText
                    primary={form.name}
                    secondary={`Created on: ${new Date(form.createdAt).toLocaleDateString()}`}
                    />
                </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={() => navigate('/create')}
      >
        Create New Form
      </Button>
    </Paper>
  );
};

export default MyForms;