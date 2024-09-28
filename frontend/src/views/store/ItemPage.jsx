import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import APIinstance from '../../utils/axios';

import GetCurrentAddress from '../plugin/UserCountry';
import UserData from '../plugin/UserData';
import CardID from '../plugin/CardID';

const ItemPage = () => {
  const [colorDrawer, setColorDrawer] = useState(false);
  const [sizeDropdown, setSizeDropdown] = useState(false);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState({});

  const param = useParams();
  const address = GetCurrentAddress();

  const userData = UserData();
  const cart_id = CardID();


  const toggleColorDrawer = () => {
    setColorDrawer(!colorDrawer);
  };

  const toggleSizeDropdown = () => {
    setSizeDropdown(!sizeDropdown);
  };

  useEffect(() => {
    APIinstance.get(`store/product-detail/${param.slug}`)
      .then(res => {
        setProduct(res.data);
        if (res.data.color && res.data.color.length > 0) {
          setColor(res.data.color[0].name);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (colorDrawer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [colorDrawer]);

  const handleColorButtonClick = (event) => {
    setColor(event.target.attributes.alt.value);
    setColorDrawer(!colorDrawer);
  };

  const handleSizeButtonClick = (size) => {
    setSize(size);
    setSizeDropdown(!sizeDropdown);
  };

  const handleToCart = async () => {
    try {
      const payload = {
        product: product.id,
        user: userData?.user_id,
        qty: quantity,
        price: parseFloat(product.price),
        shipping_amount: parseFloat(product.shipping_amount),
        country: address.country,
        size: size,
        color: color,
        cart_id: cart_id,
      };
  
      console.log("Payload:", payload);  // Debug log
  
      const response = await APIinstance.post('store/cart/', payload);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center pt-24">
      <div className="w-1/3 px-16 py-32 fixed left-0 top-0 bottom-0 flex flex-col mt-56 items-center">
        <div>
          <h3 className="text-xl font-normal text-gray-500 dark:text-gray-400 uppercase">AIM FACADE</h3>
          <h4 className="text-4xl font-extrabold dark:text-white uppercase">{product.title}</h4>
          <h5 className="text-lg text-gray-500">$ {product.price}</h5>
        </div>
      </div>


      <div className={`fixed h-5/6 p-12 z-50 left-0 top-0 bottom-0 bg-black w-1/3 flex flex-col my-24 items-center transform transition-all duration-300 ease-in-out ${
        colorDrawer ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <h5 className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400 uppercase">color</h5>
        <button 
          onClick={toggleColorDrawer}
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white">
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {product.color && product.color.map((item, index) => (
            <div key={index}>
              <button onClick={handleColorButtonClick}>
                <img className="h-auto max-w-full" src={item.image} alt={item.name} />
              </button>
            </div>
          ))}
        </div>
      </div>


      {/* images */}
      <div className="w-1/3 grid grid-cols-1 gap-8 overflow-y-auto mx-auto">
        {product.gallery && product.gallery.map((image, index) => (
          <img 
            key={index}
            src={image.image}
            alt="placeholder" 
            className="max-w-[700px] w-full h-auto object-cover"
          />
        ))}
      </div>

      {/* description */}
        <div 
          onClick={colorDrawer ? toggleColorDrawer : undefined} 
          className={`bg-black transform transition-opacity duration-300 ease-in-out ${
          colorDrawer ? 'fixed inset-0 z-40 bg-opacity-25 backdrop-blur-sm' : 'backdrop-blur-none'
        }`}>
        </div>

      <div className="mt-24 w-1/3 px-20 py-32 fixed right-0 top-0 bottom-0 flex flex-col justify-start items-center">
        <h4 className="w-full min-h-1/6 text-gray-500 dark:text-gray-400 m-2">{product.description}</h4>

        <div className="w-full flex space-x-4 m-2">
          <div className="relative w-1/2">
            <button 
              onClick={toggleColorDrawer}
              className="w-full text-white bg-inherit border border-slate-400 hover:border-white font-medium text-sm px-2 py-2.5 text-center inline-flex justify-between items-center uppercase" 
              type="button">
              {color}
            </button>
          </div>

          <div className="relative w-1/2">
            <button 
              onClick={toggleSizeDropdown}
              className="w-full text-white bg-inherit border border-slate-400 hover:border-white font-medium text-sm px-2 py-2.5 text-center inline-flex justify-between items-center uppercase" 
              type="button">
              {size ? size : 'Size'}
              <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
              </svg>
            </button>
            
              <div className={`absolute z-50 mt-2 bg-white border border-black divide-y divide-gray-100 shadow w-full dark:bg-black dark:border-white transition-all duration-300 ease-in-out transform ${
                sizeDropdown ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}>
                <ul className="text-sm text-gray-700 dark:text-gray-200">
                  {product.size && product.size.map((name, index) => (
                    <li key={index} onClick={() => handleSizeButtonClick(name.name)}>
                      <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white uppercase">{name.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            
          </div>
        </div>

        <button onClick={handleToCart} className="w-full text-black bg-gray-400 hover:bg-gray-900 font-medium text-sm px-5 py-2.5 mb-2 m-4 ml-4 uppercase">
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default ItemPage;
