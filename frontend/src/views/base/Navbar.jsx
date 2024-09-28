import React, { useEffect, useState } from 'react';
import useAuthStore from '../../store/auth';
import { Link } from 'react-router-dom';
import APIinstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import CardID from '../plugin/CardID';
import { set } from 'react-hook-form';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCheckoutDrawerOpen, setIsCheckoutDrawerOpen] = useState(false);
  const [cartUpdated, setCartUpdated] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartDetail, setCartDetail] = useState([]);
  
  const userData = UserData();
  const cart_id = CardID();

  // Combined toggle for Checkout Drawer and Scroll Lock
  const toggleCheckoutDrawer = () => {
    setIsCheckoutDrawerOpen(prev => !prev);
    document.body.style.overflow = !isCheckoutDrawerOpen ? 'hidden' : 'auto';
  }

  // Get user data
  const [isLoggedIn, user] = useAuthStore((state) => [
    state.isLoggedIn,
    state.user,
  ]);

  // Fetch cart data
  const fetchCartData = async (cartId, userId) => {
    const url = userId ? `store/cart/${cartId}/${userId}` : `store/cart/${cartId}`;
    try {
      const response = await APIinstance.get(url);
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Fetch subtotal data
  const fetchSubTotal = async (cartId, userId) => {
    const url = userId ? `store/cart-detail/${cartId}/${userId}` : `store/cart-detail/${cartId}`;
    try {
      const response = await APIinstance.get(url);
      setCartDetail(response.data);
    } catch (error) {
      console.error('Error fetching subtotal:', error);
    }
  };

  // Fetch cart data and subtotal when the cart is updated
  useEffect(() => {
    if (cart_id) {
      const userId = userData?.user_id || null;
      fetchCartData(cart_id, userId);
      fetchSubTotal(cart_id, userId);
    }
  }, [cartUpdated]);

  // Handle delete cart item
  const handleDeleteCartItem = async (itemId) => {
    const url = userData?.user_id 
      ? `store/cart-delete/${cart_id}/${itemId}/${userData?.user_id }` 
      : `store/cart-delete/${cart_id}/${itemId}/`;
    try {
      await APIinstance.delete(url);
      setCartUpdated((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle mouse enter and leave events for the account button dropdown
  // Handle mouse enter and leave events for the account button dropdown
  const handleAccountMouseEnter = () => setIsUserDropdownOpen(true)
  const handleAccountMouseLeave = () => setIsUserDropdownOpen(false)

  // Handle mouse enter and leave events for the menu button dropdown
  const handleMenuMouseEnter = () => setIsDropdownOpen(true)
  const handleMenuMouseLeave = () => setIsDropdownOpen(false)

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-black fixed top-0 left-0 w-full z-50 pt-4">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto pt-2 pb-4 m-2">
          <div className="absolute left-0 flex items-center ml-12">
            <ul className="flex flex-col md:flex-row md:space-x-8 rtl:space-x-reverse">
              <li className="relative">
                <div
                  onMouseEnter={handleMenuMouseEnter}
                  onMouseLeave={handleMenuMouseLeave}
                  className="py-2 px-3 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500">
                  AIM
                </div>

                {isDropdownOpen && ( <div className="fixed inset-0 bg-black bg-opacity-50 top-20 z-40"></div> )}

                <div 
                  onMouseEnter={handleMenuMouseEnter}
                  onMouseLeave={handleMenuMouseLeave}
                  className={`fixed pt-4 top-16 px-12 left-0 z-50 w-full bg-white border-gray-200 shadow-sm dark:bg-black transition-all duration-300 ease-in-out transform ${
                    isDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
                >
                  {/* Dropdown content */}
                  <div className="grid py-5 mx-auto text-sm text-gray-500 dark:text-gray-400 md:grid-cols-3">
                      <ul className="space-y-4 sm:mb-4 md:mb-0">
                        <Link to='/product'>
                          <li>
                            <button className="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
                              Products
                            </button>
                          </li>
                        </Link>
                      </ul>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <a href="/" className="flex-1 text-2xl font-semibold dark:text-white text-center">
            FACADE WRLD
          </a>

          <div className="absolute right-0 flex items-center space-x-3 mr-12">
            <div className='text-sm p-2 dark:text-white hover:underline'>Search</div>
            {isLoggedIn() ? (
              <>
                <div className="relative">
                  <div
                    onMouseEnter={handleAccountMouseEnter}
                    onMouseLeave={handleAccountMouseLeave}
                    className="text-sm p-2 dark:text-white hover:underline cursor-pointer"
                  >
                    Account
                  </div>

                    <div
                      onMouseEnter={handleAccountMouseEnter}
                      onMouseLeave={handleAccountMouseLeave}
                      className={`absolute pt-2 top-full z-50 bg-white dark:bg-black shadow-lg transition-all duration-300 ease-in-out transform ${
                        isUserDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                      }`}
                    >
                      <div className="w-full py-5 text-sm text-gray-500 dark:text-gray-400">
                        <ul className="space-y-4 sm:mb-4 md:mb-0">
                          <li>
                            <a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
                              Profile
                            </a>
                          </li>
                          <li>
                            <a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
                              Settings
                            </a>
                          </li>
                          <li>
                            <a href="/logout" className="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
                              Logout
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                </div>
              </>
            ) : (
              <Link to="/login" className="text-sm p-2 dark:text-white hover:underline">
                Account
              </Link>
            )}

            <button onClick={toggleCheckoutDrawer} className="text-sm p-2 dark:text-white hover:underline">Bag</button>
              <>
              {isCheckoutDrawerOpen && (
                <div
                  className={`fixed inset-0 z-40 bg-black bg-opacity-25 transform transition-opacity duration-300 ease-in-out ${
                    isCheckoutDrawerOpen ? 'backdrop-blur-sm' : 'backdrop-blur-none'
                  }`}
                  onClick={toggleCheckoutDrawer}
                ></div>
              )}


                <div className={`fixed top-0 right-0 z-50 h-screen bg-white dark:bg-black w-1/3 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
                    isCheckoutDrawerOpen ? 'translate-x-0' : 'translate-x-full'
                  }`}
                >
                  <div className="flex flex-col items-center h-full pt-12 pl-12 pr-12">
                    <div className="w-full">
                      <h5 className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Shopping Cart
                      </h5>
                      <button
                        type="button"
                        onClick={toggleCheckoutDrawer}
                        className="text-gray-500 hover:text-white mt-8 mr-12 text-xs w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-right uppercase">
                        close
                      </button>

                      <div className="grid gap-4 mt-4">
                        {cart.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.product.image}
                              alt="Product 01"
                              className="w-16 object-cover rounded-sm"
                            />
                            <div>
                              <h6 className="text-sm font-semibold text-gray-900 dark:text-gray-300">{item.product.title}</h6>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{item.qty} x {item.price}</p>
                            </div>
                          </div>
                          <button onClick={() => handleDeleteCartItem(item.id)} className="text-gray-500 hover:text-white text-2xs font-medium uppercase">
                            REMOVE
                          </button>
                        </div>
                        ))}
                      </div>
                    </div>

                    <div className="w-full mt-auto mb-8">
                      <div className="flex items-center justify-between">
                        <h6 className="text-sm font-semibold text-gray-900 dark:text-gray-300 uppercase">Subtotal</h6>
                        <p className="text-sm text-gray-500 dark:text-gray-400">$ {cartDetail.sub_total}</p>
                      </div>
                      <Link to='/checkout'>
                        <button className="w-full mt-4 text-white bg-blue-600 hover:bg-blue-700 font-semibold text-sm py-3 uppercase">
                          Checkout
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
