import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import UserData from '../plugin/UserData';
import CardID from '../plugin/CardID';
import APIinstance from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth';

const CheckoutPage = () => {
    const [cart, setCart] = useState([]);
    const [cartDetail, setCartDetail] = useState([]);
    const {coupon, setCoupon} = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [fullName, setFullName] = useState('');

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [apartment, setApartment] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');


    const userData = UserData();
    const cart_id = CardID();
    const navigate = useNavigate();

    // Get user data
    const [isLoggedIn, user] = useAuthStore((state) => [
        state.isLoggedIn,
        state.user,
    ]);

    console.log(userData);

    // Fetch cart data
    const fetchCartData = async (cartId, userId) => {
        const url = userId ? `store/cart/${cartId}/${userId}` : `store/cart/${cartId}`;
        try {
        const response = await APIinstance.get(url);
        setCart(response.data);
        } catch (error) {
        console.error('Error fetching cart data:', error);
        }
    }

    // Fetch cart details
    const fetchCartDetail = async (cartId, userId) => {
        const url = userId ? `store/cart-detail/${cartId}/${userId}` : `store/cart-detail/${cartId}`;
        try {
        const response = await APIinstance.get(url);
        setCartDetail(response.data);
        } catch (error) {
        console.error('Error fetching cart details:', error);
        }
    }
    // Handle full name update when first or last name changes
    useEffect(() => {
        setFullName(`${firstName} ${lastName}`);
    }, [firstName, lastName])

    // Fetch data when component mounts
    if (cart_id !== null || cart_id !== undefined) {
        if (userData !== undefined) {
        useEffect(() => {
            fetchCartData(cart_id, userData?.user_id);
            fetchCartDetail(cart_id, userData?.user_id);
        }, [])
        } else {
        useEffect(() => {
            fetchCartData(cart_id, null);
            fetchCartDetail(cart_id, null);
        }, [])
        }
    }

    // Handle form field changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
        case 'firstName':
            setFirstName(value);
            break;
        case 'lastName':
            setLastName(value);
            break;
        case 'email':
            setEmail(value);
            break;
        case 'phone':
            setPhone(value);
            break;
        case 'address':
            setAddress(value);
            break;
        case 'apartment':
            setApartment(value);
            break;
        case 'city':
            setCity(value);
            break;
        case 'province':
            setProvince(value);
            break;
        case 'postalCode':
            setPostalCode(value);
            break;
        case 'country':
            setCountry(value);
            break;
        default:
            break;
        }
    }

    const createOrder = async () => {
        const payload = {
            full_name: fullName,
            email: email,
            phone: phone,
            address: address,
            apartment: apartment,
            city: city,
            province: province,
            postal_code: postalCode,
            country: country,
            cart_id: cart_id,
            user_id: userData?.user_id,
        }
        try {
            const response = await APIinstance.post('store/order/', payload);
            navigate(`/shipping/${response.data.oid}`);
        } catch (error) {
            console.error('Error posting create order:', error);
        }
    }

    /*
    const applyCoupon = async () => {
        const payload = {
            order_oid: cartDetail.oid,
            coupon_code: coupon,
        }
        try {
            const response = await APIinstance.post('store/coupon/', payload);
            console.log(response.data.message);
        } catch (error) {
            console.error('Error posting Discount:', error);
        }
    }
    */
  return (
    <>
        <div className='flex flex-col w-2/3 border-r h-screen 2xl:pl-96 xl:px-56 pt-24 items-center'>
            <Link to='/' className='text-4xl font-semibold text-gray-900 dark:text-white mb-6 uppercase'>Facade Wrld</Link>
            <div className='flex mb-4'>
                <ol className='inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse'>
                    <li className='inline-flex items-center'>
                        <Link to="/cart" className="inline-flex items-center text-xs font-small text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white uppercase">cart</Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="rtl:rotate-180 w-2 h-2 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                            </svg>
                            <span className="ms-1 text-xs font-small text-white md:ms-2 dark:text-white uppercase">Information</span>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="rtl:rotate-180 w-2 h-2 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                            </svg>
                            <span className="ms-1 text-xs font-small text-gray-700 md:ms-2 dark:text-gray-400  uppercase">Shipping</span>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="rtl:rotate-180 w-2 h-2 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                            </svg>
                            <span className="ms-1 text-xs font-small text-gray-700 md:ms-2 dark:text-gray-400  uppercase">Payment</span>
                        </div>
                    </li>
                </ol>
            </div>
            <div className="flex items-center justify-between w-full mb-2">
                
                {isLoggedIn ? (
                    <div className='mb-6'>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Contact</h1>
                        <div className=''>
                            <h1 className='text-md font-small text-gray-900 dark:text-gray-400'>{userData.email}</h1>
                        </div>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Contact</h1>
                        <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-500 ml-4">Login</Link>
                        <form className="w-full">
                            <div className="mb-6">
                                <input 
                                    type="email" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full block rounded-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
                                    placeholder="Email" 
                                    onChange={handleChange}
                                    value={email}
                                    name='email'
                                    required 
                                />
                            </div>
                        </form>
                    </>
                )}
                
            </div>

            <div className="flex items-center justify-between w-full mb-2">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Shipping Address</h1>
            </div>
            <form className="w-full">
                <div className="mb-6">
                    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            onChange={handleChange}
                            value={country}
                            name='country'
                            required>
                        <option value="" disabled >Country</option>
                        <option value="Canada">Canada</option>
                        <option value="us">United States</option>
                    </select>
                </div> 
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <input 
                            type="text" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="First Name" 
                            onChange={handleChange}
                            value={firstName}
                            name='firstName'
                            required 
                        />
                    </div>
                    <div>
                        <input 
                            type="text" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Last Name" 
                            onChange={handleChange}
                            value={lastName}
                            name='lastName'
                            required 
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <input 
                        type="text" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="Address" 
                        onChange={handleChange}
                        value={address}
                        name='address'
                        required 
                    />
                </div>
                <div className='mb-6'>
                    <input 
                        type="text" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="Apartment, Suite, Etc. (Optional)"
                        onChange={handleChange}
                        value={apartment}
                        name='apartment'
                    />
                </div> 
                <div className="grid gap-6 mb-6 md:grid-cols-3">
                    <div>
                        <input 
                            type="text" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="City" 
                            onChange={handleChange}
                            value={city}
                            name='city'
                            required 
                        />
                    </div> 
                    <div>
                        <select 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            onChange={handleChange} 
                            value={province}
                            name='province'
                            required
                        >
                            <option value="" disabled>Province</option>
                            <option value="Ontario">Ontario</option>
                            <option value="Quebec">Quebec</option>
                        </select>
                    </div> 
                    <div>
                        <input 
                            type="text" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Postal Code" 
                            onChange={handleChange}
                            value={postalCode}
                            name='postalCode'
                            required 
                        />
                    </div> 
                </div>
                <div className='mb-6'>
                    <input 
                        type="tel" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="Phone" 
                        onChange={handleChange}
                        value={phone}
                        name='phone'
                        required 
                    />
                </div>
                <br />
                <div className="flex items-center justify-between w-full mb-2">
                    <button className=''>
                        <Link to="/cart" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">Back to Cart</Link>
                    </button>
                <button
                    type="button"
                    onClick={createOrder}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium  text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Submit
                </button>
                </div>
            </form>

            <footer className="bg-white border-gray-200 dark:bg-cover dark:bg-center dark:bg-black absolute bottom-0">
                <br />
                <div className="w-full px-12 p-4 py-6 lg:py-8">
                    <div className="sm:flex sm:items-center sm:justify-between">


                        <div className="flex mt-4 sm:justify-center sm:mt-0 gap-6">
                            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                                        <path fillRule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clipRule="evenodd"/>
                                    </svg>
                                <span className="sr-only">Facebook page</span>
                            </a>
                            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 16">
                                        <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z"/>
                                    </svg>
                                <span className="sr-only">Discord community</span>
                            </a>
                            <a href="https://x.com/6lvcknight" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                                    <path fillRule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clipRule="evenodd"/>
                                </svg>
                                <span className="sr-only">Twitter page</span>
                            </a>
                            <a href="https://github.com/6lvcknight" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd"/>
                                </svg>
                                <span className="sr-only">GitHub account</span>
                            </a>
                            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 0a10 10 0 1 0 10 10A10.009 10.009 0 0 0 10 0Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.094 20.094 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM8 1.707a8.821 8.821 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.758 45.758 0 0 0 8 1.707ZM1.642 8.262a8.57 8.57 0 0 1 4.73-5.981A53.998 53.998 0 0 1 9.54 7.222a32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.64 31.64 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM10 18.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 13.113 11a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z" clipRule="evenodd"/>
                                </svg>
                                <span className="sr-only">Dribbble account</span>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>

        <div className='w-1/3'>
            <div className='fixed top-0 right-0 z-40 h-screen overflow-y-auto transition-transform translate-x-0 bg-white w-1/3 dark:bg-black' tabIndex="-1" aria-labelledby="drawer-right-label">
                <div className="flex flex-col items-center justify-between h-full pt-12 pl-12 pr-12">
                    <div className="">
                        <div className="grid gap-4 mt-4">
                        {cart?.map((item, index) => (
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
                            </div>
                        ))}
                        </div>
                        <div className="flex items-center flex-shrink-0 w-full mx-auto sm:w-auto m-6">
                            <form className="flex flex-col items-center w-full md:flex-row">
                                <input type="text" placeholder="Discount" 
                                    className="bg-white border border-gray-300 text-gray-900 md:w-64 mb-2 md:mb-0 md:me-4 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    onChange={'(e) => setCoupon(e.target.value)'}
                                    />
                                <button
                                    type="button"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    onClick={'applyCoupon'}
                                    >
                                        APPLY
                                    </button>
                            </form>
                        </div>
                        <div>
                            <div className="flex mb-2 items-center justify-between">
                                <h6 className="text-sm font-semibold text-gray-900 dark:text-gray-300 uppercase">Subtotal</h6>
                                <p className="text-sm text-gray-500 dark:text-gray-400">$ {cartDetail.sub_total}</p>
                            </div>
                            <div className="flex mb-2 items-center justify-between">
                                <h6 className="text-sm font-semibold text-gray-900 dark:text-gray-300 uppercase">Shipping</h6>
                                <p className="text-sm text-gray-500 dark:text-gray-400">$ {cartDetail.shipping}</p>
                            </div>
                            <div className="flex mb-2 items-center justify-between">
                                <h6 className="text-sm font-semibold text-gray-900 dark:text-gray-300 uppercase">Tax</h6>
                                <p className="text-sm text-gray-500 dark:text-gray-400">$ {cartDetail.tax_fee}</p> 
                            </div>
                            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                            <div className="flex items-center justify-between">
                                <h6 className="text-sm font-semibold text-gray-900 dark:text-gray-300 uppercase">Total</h6>
                                <p className="text-sm text-gray-500 dark:text-gray-400">$ {cartDetail.total}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default CheckoutPage
