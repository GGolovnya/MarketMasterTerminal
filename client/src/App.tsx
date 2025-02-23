// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import  Login  from './pages/LoginPage';
import  Register from './pages/RegisterPage';
import { useAuth } from './contexts/AuthContext';
import Terminal from './pages/TerminalPage';
import PersonalAccount from './pages/PersonalAccount';
import HomePage from './pages/HomePage';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return null;
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export const App = () => {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/profile" element={
          <PrivateRoute>
            <PersonalAccount/>
          </PrivateRoute>
        } />
        <Route path="/terminal" element={
          <PrivateRoute>
            <Terminal/>
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};