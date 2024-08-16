import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'

import LoginPage from './views/auth/LoginPage';
import RegisterPage from './views/auth/RegisterPage';


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
      {/*isNavbarVisible && <Sidebar />*/}
      <div className="flex-grow overflow-hidden">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App
