import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'

import MainWrapper from './layout/MainWrapper'

import Navbar from './views/base/Navbar';
import Footer from './views/base/Footer';

// Importing auth views
import LoginPage from './views/auth/LoginPage';
import RegisterPage from './views/auth/RegisterPage';
import HomePage from './views/HomePage';
import LogoutPage from './views/auth/LogoutPage';
import ForgotPassPage from './views/auth/ForgotPassPage';
import ChangePassPage from './views/auth/ChangePassPage';

// Importing store views
import ProductPage from './views/store/ProductPage';
import ItemPage from './views/store/ItemPage';
import CheckoutPage from './views/store/CheckoutPage';
import CartPage from './views/store/CartPage';

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
  const hideNavbarRoutes = ['/checkout'];
  const hideFooterRoutes = ['/login', '/register', "/logout", "/password-reset", "/password-reset/:otp/:uidb64", '/checkout'];
  const isNavbarVisible = !hideNavbarRoutes.includes(location.pathname);
  const isFooterVisible = !hideFooterRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col h-screen">
      {isNavbarVisible && <Navbar />}
      <div className="flex-grow dark:bg-black">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path='/checkout' element={<CheckoutPage />} />
          <Route path="/password-reset" element={<ForgotPassPage />} />
          <Route path="/password-reset/:otp/:uidb64" element={<ChangePassPage />} />

          <Route path="/product" element={<ProductPage />} />
          <Route path="/product/:slug" element={<ItemPage />} />
        </Routes>
      </div>
      {isFooterVisible && <Footer />}
    </div>
  );
};

export default App
