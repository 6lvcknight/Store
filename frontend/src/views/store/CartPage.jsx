import React, { useEffect, useState } from 'react';
import instance from '../../utils/axios';
import UserData from '../plugin/UserData';
import CardID from '../plugin/CardID';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const [qtyNumber, setQtyNumber] = useState(1);
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


  const qtyDecrease = () => {
    if (qtyNumber > 1) {
      setQtyNumber(qtyNumber - 1);
    }
  }

  const qtyIncrease = () => {
    setQtyNumber(qtyNumber + 1);
  }

  return (
    <div>
      <div className="flex items-start justify-center min-h-screen bg-white dark:bg-black pt-24">
        <div className='w-1/2 text-white rounded-xl p-[30px] backdrop-opacity-30'>
          <h1 className='text-white text-sm text-center font-bold uppercase mb-20'>Cart</h1>
          {cart?.map((item, index) => (
          <div key={index} className='grid grid-flow-row-dense grid-cols-5 items-center'>
            <img className='col-span-1 max-w-[150px] w-full h-auto object-cover' src={item.product.image} alt="Product" />
            <div className='col-span-2 m-4'>
              <button className='text-white text-sm font-semibold uppercase'>{item.product.title}</button>
              <h4 className='text-white text-xs font-light'>$ {item.price}</h4>
              <h4 className='text-white text-xs font-light uppercase mb-2'>{item.color} / {item.size}</h4>
              <button className='text-white text-xs font-light uppercase'>REMOVE</button>
            </div>
            <div className='col-span-1 flex flex-col items-center justify-center'>
              <label className='text-white text-xs font-light mb-1'>QTY</label>
              <div className="relative flex items-center">
                <button type="button" onClick={qtyDecrease} aria-label="Decrease quantity" className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                  <svg className="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                  </svg>
                </button>
                <input type="text" className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center" value={qtyNumber} readOnly />
                <button type="button" onClick={qtyIncrease} aria-label="Increase quantity" className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                  <svg className="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                  </svg>
                </button>
              </div>
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
