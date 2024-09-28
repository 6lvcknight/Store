import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation, matchPath } from 'react-router-dom'


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
import ShippingPage from './views/store/ShippingPage';
import { setUser } from './utils/auth';

import { ItemSkeleton } from './views/skeleton/ItemSkeleton';

const App = () => {
  useEffect(() => {
    setUser()
  }, []);
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

  // Define the routes where the Navbar and Footer should be hidden
  const hideNavbarRoutes = ['/checkout', '/shipping/:order_oid/'];
  const hideFooterRoutes = ['/login', '/register', '/logout', '/password-reset', '/password-reset/:otp/:uidb64', '/checkout', '/shipping/:order_oid/'];

  // Helper function to check if the current path matches any of the defined paths
  const isPathMatching = (paths) => paths.some((path) => matchPath(path, location.pathname));

  // Determine whether to show the Navbar and Footer based on the current path
  const isNavbarVisible = !isPathMatching(hideNavbarRoutes);
  const isFooterVisible = !isPathMatching(hideFooterRoutes);

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
          <Route path='/shipping/:order_oid/' element={<ShippingPage />} />
          <Route path="/password-reset" element={<ForgotPassPage />} />
          <Route path="/password-reset/:otp/:uidb64" element={<ChangePassPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/product/:slug" element={<ItemPage />} />

          <Route path="/skeleton" element={<ItemSkeleton />} />
        </Routes>
      </div>
      {isFooterVisible && <Footer />}
    </div>
  );
};

export default App
