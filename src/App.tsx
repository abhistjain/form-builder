import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Typography, AppBar, Toolbar } from '@mui/material';
import MyForms from './pages/MyForms';
import FormBuilder from './pages/FormBuilder';
import FormPreview from './pages/FormPreview';

function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 , padding : 2 }}>
            upliance.ai <br/> Form Builder  Application
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/myforms" replace />} />
          <Route path="/myforms" element={<MyForms />} />
          <Route path="/create" element={<FormBuilder />} />
          <Route path="/preview/:formId" element={<FormPreview />} />
          <Route path="*" element={<Typography>404 Not Found</Typography>} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
