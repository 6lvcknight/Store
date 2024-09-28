import React, { useEffect, useState } from 'react'
import PSkeleton from '../skeleton/pSkeleton'

import APIinstance from '../../utils/axios'
import { Link } from 'react-router-dom'

const ProductPage = () => {
    const [product, setProduct] = useState([])
    const [category, setCategory] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      APIinstance.get('store/product/')
            .then(res => {
                setProduct(res.data)
            })
            .catch(err => {
                console.log(err)
            })
            setIsLoading(false);
    },[])

    useEffect(() => {
      APIinstance.get('store/category/')
          .then(res => {
              setCategory(res.data)
          })
          .catch(err => {
              console.log(err)
          })
  },[])

  if(isLoading) {
    return <PSkeleton />
  }
  
  return (
    <div className='pt-24'>
      <div className="grid grid-cols-2 md:grid-cols-3 md:p-12 gap-8 overflow-auto">
        {product.map((product, index) => (
          <div key={index}>
            <Link to={`/product/${product.slug}`}>
              <img 
                className="h-auto max-w-full object-cover" 
                src={product.image} 
                style={{ height: 'clamp(20rem, 100%, 44rem)' }} 
                alt={product.title}
              />
            </Link>
            <div className='mt-4'>
              <h5 className="text-lg dark:text-white">{product.title}</h5>
              <h6 className="text-sm dark:text-neutral-400">${product.price}</h6>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductPage
