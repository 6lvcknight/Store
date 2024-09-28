import React from 'react'

export const ItemSkeleton = () => {
  return (
    <div className="flex justify-center pt-24">
      <div className="w-1/3 px-16 py-32 fixed left-0 top-0 bottom-0 flex flex-col mt-56 items-center">
        <div className='animate-pulse'>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[250px] mb-2.5"></div>
        </div>
      </div>

      {/* images */}
      <div className="w-1/3 grid grid-cols-1 gap-8 overflow-y-auto mx-auto animate-pulse">
        <div class="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
            </svg>
        </div>
      </div>

      <div className="mt-24 w-1/3 px-20 py-32 fixed right-0 top-0 bottom-0 flex flex-col justify-start items-center">

        <div className="w-full flex space-x-4 m-2">
          
        </div>

      </div>
    </div>
  )
}
