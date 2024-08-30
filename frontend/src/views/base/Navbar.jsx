import React, { useEffect, useState } from 'react';
import useAuthStore from '../../store/auth';
import { Link } from 'react-router-dom';
import instance from '../../utils/axios';
import UserData from '../plugin/UserData';
import CardID from '../plugin/CardID';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCheckoutDrawerOpen, setIsCheckoutDrawerOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const toggleCheckoutDrawer = () => {
    setIsCheckoutDrawerOpen(!isCheckoutDrawerOpen);
  };

  const [isLoggedIn, user] = useAuthStore((state) => [
    state.isLoggedIn,
    state.user,
  ]);

  const [cart, setCart] = useState([]);
    const userData = UserData();
    const cart_id = CardID();

    const fetchCartData = async (cartId, userId) => {
        const url = userId ? `store/cart/${cartId}/${userId}` : `store/cart/${cartId}`;
        try {
        const response = await instance.get(url);
        setCart(response.data);
        } catch (error) {
        console.error('Error:', error);
        }
    }

    if (cart_id !== null || cart_id !== undefined) {
        if (userData!== undefined) {
        useEffect(() => {
            fetchCartData(cart_id, userData?.user_id);
        }, [])
        } else {
        useEffect(() => {
            fetchCartData(cart_id, null);
        }, [])
        }
    }

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-black fixed pt-4 top-0 left-0 w-full z-50">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto pt-2 pb-4 m-2">

          <div className="absolute left-0 flex items-center ml-12">
            <div className="items-left justify-between hidden w-full md:flex md:w-auto md:relative">
              <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0">
                <li className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="py-2 px-3 text-white md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500">
                    AIM
                  </button>

                  {isDropdownOpen && (
                    <div className="fixed mt-4 top-16 left-0 z-50 w-full bg-white border-gray-200 shadow-sm border-b dark:bg-black dark:border-gray-600">
                      <div className="grid px-4 py-5 mx-auto text-sm text-gray-500 dark:text-gray-400 md:grid-cols-3 md:px-6">
                        <ul className="space-y-4 sm:mb-4 md:mb-0" aria-labelledby="mega-menu-full-cta-dropdown-button">
                          <li>
                            <a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
                              Online Stores
                            </a>
                          </li>
                          <li>
                            <a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
                              Segmentation
                            </a>
                          </li>
                          <li>
                            <a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
                              Marketing CRM
                            </a>
                          </li>
                          <li>
                            <a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
                              Online Stores
                            </a>
                          </li>
                        </ul>
                        <ul className="hidden mb-4 space-y-4 md:mb-0 sm:block">
                          <li>
                            <a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
                              Our Blog
                            </a>
                          </li>
                          <li>
                            <a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
                              Terms & Conditions
                            </a>
                          </li>
                          <li>
                            <a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
                              License
                            </a>
                          </li>
                          <li>
                            <a href="#" className="hover:underline hover:text-blue-600 dark:hover:text-blue-500">
                              Resources
                            </a>
                          </li>
                        </ul>
                        <div className="mt-4 md:mt-0">
                          <h2 className="mb-2 font-semibold text-gray-900 dark:text-white">Our brands</h2>
                          <p className="mb-2 text-gray-500 dark:text-gray-400">
                            At Flowbite, we have a portfolio of brands that cater to a variety of preferences.
                          </p>
                          <a
                            href="#"
                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 dark:hover:text-blue-700">
                            Explore our brands
                            <span className="sr-only">Explore our brands</span>
                            <svg
                              className="w-3 h-3 ms-2 rtl:rotate-180"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 10">
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                              />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>

          <a href="/" className="flex items-center justify-center flex-1">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">FACADE WRLD</span>
          </a>

          <div className="absolute right-0 flex items-center space-x-3 mr-12">
            <div className="flex items-right md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <button
                type="button"
                data-collapse-toggle="navbar-search"
                aria-controls="navbar-search"
                aria-expanded="false"
                className="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1">
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span className="sr-only">Search</span>
              </button>
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <span className="sr-only">Search icon</span>
                </div>
                <input
                  type="text"
                  id="search-navbar"
                  className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search..."
                />
              </div>
              {isLoggedIn() ? (
                <>
                  <button
                    onClick={toggleUserDropdown}
                    className="text-sm p-2 text-gray-900 dark:text-white hover:underline">
                    Account
                  </button>
                  {isUserDropdownOpen && (
                    <div className="fixed mt-4 top-16 right-0 z-50 w-full bg-white border-gray-200 shadow-sm border-b dark:bg-black dark:border-gray-600">
                      <div className="grid px-4 py-5 mx-auto text-sm text-gray-500 dark:text-gray-400 md:grid-cols-3 md:px-6">
                        <ul className="space-y-4 sm:mb-4 md:mb-0" aria-labelledby="mega-menu-full-cta-dropdown-button">
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
                  )}
                </>
              ) : (
                <>
                  <a href="/login" className="text-sm p-2 text-gray-900 dark:text-white hover:underline">Account</a>
                </>
              )}

              <button onClick={toggleCheckoutDrawer} className="text-sm p-2 text-gray-900 dark:text-white hover:underline">Bag</button>
              {isCheckoutDrawerOpen && (
                <div className={`fixed top-0 right-0 z-40 h-screen overflow-y-auto transition-transform ${isCheckoutDrawerOpen ? 'translate-x-0' : 'translate-x-full'} bg-white w-1/3 dark:bg-black`} tabIndex="-1" aria-labelledby="drawer-right-label">
                  <div className="flex flex-col items-center justify-between h-full pt-12 pl-12 pr-12">
                    <div className="w-full">
                      <h5 className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Shopping Cart
                      </h5>
                      <button
                        type="button"
                        onClick={toggleCheckoutDrawer}
                        aria-controls="drawer-right-example"
                        className="text-gray-400 mt-8 mr-4 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span className="sr-only">Close menu</span>
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
                          <button className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                        ))}
                      </div>
                    </div>

                    <div className="w-full mt-auto mb-8">
                      <div className="flex items-center justify-between">
                        <h6 className="text-sm font-semibold text-gray-900 dark:text-gray-300 uppercase">Subtotal</h6>
                        <p className="text-sm text-gray-500 dark:text-gray-400">$44.98</p>
                      </div>
                      <Link to='/checkout'>
                        <button className="w-full mt-4 text-white bg-blue-600 hover:bg-blue-700 font-semibold text-sm py-3 uppercase">
                          Checkout
                        </button>
                      </Link>
                    </div>  
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
