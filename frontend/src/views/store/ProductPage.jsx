import React, { useEffect, useState } from 'react'

import instance from '../../utils/axios'
import { Link } from 'react-router-dom'

const ProductPage = () => {
    const [product, setProduct] = useState([])

    useEffect(() => {
        instance.get('store/product/')
            .then(res => {
                setProduct(res.data)
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    },[])

    useEffect(() => {
      instance.get('store/category/')
          .then(res => {
              console.log(res.data)
          })
          .catch(err => {
              console.log(err)
          })
  },[])
  return (
    <>
      <div class="grid grid-cols-2 md:grid-cols-3 md:p-12 gap-8">
        {product.map((product, index) => (
        <div key={index}>
          <Link to={`/product/${product.slug}`}>
            <img 
              className="h-auto max-w-full" 
              src={product.image} 
              style={{height: '44rem', objectFit: 'cover'}}
            />
          </Link>
            <div className='mt-4'>
              <h5 className="text-l dark:text-white">{product.title}</h5>
              <h6 className="text-sm dark:text-neutral-400">${product.price}</h6>
            </div>
        </div>
        ))}
      </div>
    </>
  )
}

export default ProductPage
