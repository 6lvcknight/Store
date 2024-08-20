import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'

import MainWrapper from './layout/MainWrapper'

import Navbar from './views/base/Navbar';
import LoginPage from './views/auth/LoginPage';
import RegisterPage from './views/auth/RegisterPage';
import HomePage from './views/HomePage';
import LogoutPage from './views/auth/LogoutPage';
import ForgotPassPage from './views/auth/ForgotPassPage';
import ChangePassPage from './views/auth/ChangePassPage';
import Footer from './views/base/Footer';


const App = () => {
  return (
    <>
    <Router>
        <AppContent />
    </Router>
    </>
  );
};

const AppContent = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', 'register'];
  const isNavbarVisible = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {isNavbarVisible && <Navbar />}
      <div className="flex-grow overflow-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/password-reset" element={<ForgotPassPage />} />
          <Route path="/password-reset/:otp/:uidb64" element={<ChangePassPage />} />
        </Routes>
      </div>
      {isNavbarVisible && <Footer />}
    </div>
  );
};

export default App
