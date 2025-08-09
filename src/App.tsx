import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Typography, AppBar, Toolbar } from '@mui/material';
import MyForms from './pages/MyForms';

function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            upliance.ai Form Builder
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/myforms" replace />} />
          <Route path="/myforms" element={<MyForms />} />
          <Route path="*" element={<Typography>404 Not Found</Typography>} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
