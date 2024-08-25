import React from 'react'

const ItemPage = () => {
  return (
    <div className="flex justify-center">
      <div className="w-1/3"></div>
      <div className="w-1/3 grid grid-cols-1 gap-8">
        <img 
          src="https://via.placeholder.com/900x1200" 
          alt="placeholder" 
          className="max-w-[700px] w-full h-auto object-cover"
        />
        <img 
          src="https://via.placeholder.com/900x1200" 
          alt="placeholder" 
          className="max-w-[700px] w-full h-auto object-cover"
        />
        <img 
          src="https://via.placeholder.com/900x1200" 
          alt="placeholder" 
          className="max-w-[700px] w-full h-auto object-cover"
        />
        <img 
          src="https://via.placeholder.com/900x1200" 
          alt="placeholder" 
          className="max-w-[700px] w-full h-auto object-cover"
        />
        <img 
          src="https://via.placeholder.com/900x1200" 
          alt="placeholder" 
          className="max-w-[700px] w-full h-auto object-cover"
        />
      </div>
      <div className='w-1/3'></div>
    </div>
  )
}

export default ItemPage
