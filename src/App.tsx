import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AuthPage from './components/AuthPage';
import { DataTable } from './components/Table';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';

const theme = createTheme();

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {token && (
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                CRM
              </Typography>
              <Box display="flex" alignItems="center">
              {isSubmitting && <CircularProgress size={20} sx={{color: "white", marginRight: "20px"}} />}
                <Typography variant="body1" component="div" sx={{ marginRight: 2 }}>
                  Привет, User
                </Typography>
               

                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
        )}
        <Routes>
          <Route
            path="/login"
            element={
              token ? <Navigate to="/" /> : <AuthPage onLogin={handleLogin} />
            }
          />
          <Route
            path="/"
            element={
              token ? (
                <>
                  <DataTable token={token} setIsSubmitting={setIsSubmitting}/>
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
