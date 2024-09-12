import React, { useEffect, useState } from 'react';
import APIinstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import CardID from '../plugin/CardID';
import { Link, useParams } from 'react-router-dom';
import GetCurrentAddress from '../plugin/UserCountry';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const userData = UserData();
  const cart_id = CardID();
  const [product, setProduct] = useState({});
  const [cartUpdated, setCartUpdated] = useState(false);

  const address = GetCurrentAddress();


  const fetchCartData = async (cartId, userId) => {
    const url = userId ? `store/cart/${cartId}/${userId}` : `store/cart/${cartId}`;
    try {
      const response = await APIinstance.get(url);
      setCart(response.data);
      // Initialize quantities for each cart item
      const initialQuantities = {};
      response.data.forEach(item => {
        initialQuantities[item.product.id] = item.qty;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (cart_id) {
      const userId = userData?.user_id || null;
      fetchCartData(cart_id, userId);
    }
  }, [cartUpdated]);

  const qtyDecrease = (productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(1, prevQuantities[productId] - 1),
    }));
  };

  const qtyIncrease = (productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: prevQuantities[productId] + 1,
    }));
  };

  const updateCart = async (item) => {
    try {
      const updatedQty = quantities[item.product.id]

      const payload = {
        product: item.product.id,
        user: userData?.user_id,
        qty: updatedQty,
        price: parseFloat(item.product.price),
        shipping_amount: parseFloat(item.product.shipping_amount),
        country: address.country,
        size: item.size,
        color: item.color,
        cart_id: cart_id,
      };
  
      const response = await APIinstance.post('store/cart/', payload);
      console.log(response.data);

      setCartUpdated(prev => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCartItem = async (itemId) => {
    const url = userData?.user_id 
      ? `store/cart-delete/${cart_id}/${itemId}/${userData?.user_id }` 
      : `store/cart-delete/${cart_id}/${itemId}/`;
    try {
      const response = await APIinstance.delete(url);
      console.log(response.data);
      setCartUpdated(prev => !prev);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className="flex items-start justify-center min-h-screen bg-white dark:bg-black pt-24">
        <div className='w-1/2 text-white rounded-xl p-[30px] backdrop-opacity-30'>
          <h1 className='text-white text-sm text-center font-bold uppercase mb-20'>Cart</h1>
          {cart?.map((item, index) => (
            <div key={index} className='grid grid-flow-row-dense grid-cols-5 items-center mt-4'>
              <img className='col-span-1 max-w-[150px] w-full h-auto object-cover' src={item.product.image} alt="Product" />
              <div className='col-span-2 m-4'>
                <button className='text-white text-sm font-semibold uppercase'>{item.product.title}</button>
                <h4 className='text-white text-xs font-light'>$ {item.price}</h4>
                <h4 className='text-white text-xs font-light uppercase mb-2'>{item.color} / {item.size}</h4>
                <button onClick={() => handleDeleteCartItem(item.id)} className='text-gray-500 hover:text-white text-xs font-medium uppercase'>
                  REMOVE
                </button>
              </div>
              <div className='col-span-1 flex flex-col items-center justify-center'>
                <label className='text-white text-xs font-light mb-1'>QTY</label>
                <div className="relative flex items-center">
                  <button
                    type="button"
                    onClick={() => qtyDecrease(item.product.id)}
                    aria-label="Decrease quantity"
                    className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                  >
                    <svg className="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                    </svg>
                  </button>
                  <input type="text" className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center" value={quantities[item.product.id]} readOnly />
                  <button
                    type="button"
                    onClick={() => qtyIncrease(item.product.id)}
                    aria-label="Increase quantity"
                    className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                  >
                    <svg className="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                    </svg>
                  </button>
                </div>
                <button onClick={() => updateCart(item)} className='text-gray-500 hover:text-white text-xs font-medium mt-2 uppercase'>update</button>
              </div>
              <div className='col-span-1 flex flex-col items-end justify-center'>
                <h4 className='text-white text-xs font-light'>$ {item.sub_total}</h4>
              </div>
            </div>
          ))}
          {cart.length > 0 && (
            <div className='flex justify-end mt-20'>
              <Link to='/checkout' className='text-lg text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium uppercase'>CHECKOUT</Link>
            </div>
          )}
          {cart.length === 0 && (
            <div className='flex justify-center mt-20'>
              <h4 className='text-white text-xs font-medium uppercase'>Cart is empty</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
