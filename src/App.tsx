import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AuthPage from './AuthPage';
import DataTable from './DataTable';

const theme = createTheme();

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

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
        <Routes>
          <Route path="/login" element={
            token ? <Navigate to="/" /> : <AuthPage onLogin={handleLogin} />
          } />
          <Route path="/" element={
            token ? (
              <>
                <button onClick={handleLogout}>Logout</button>
                <DataTable token={token} />
              </>
            ) : (
              <Navigate to="/login" />
            )
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
