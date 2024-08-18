import { Mail } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import instance from '../../utils/axios'

const ForgotPassPage = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        instance.get(`user/reset-password/${ email }/`).then((response) => {
            console.log(response)
        }).catch((error) => {
            console.log(error)
        })
    }


  return (
    <div className="flex items-center justify-center min-h-screen">
            <div className='w-[420px] border-[2px] border-solid border-[#B4BFC5] text-white rounded-xl p-[30px] backdrop-opacity-30'>
                <h1 className='text-[#DEDAD7] text-[36px] text-center font-bold'>Reset Password</h1>
                <form onSubmit={handleSubmit} className='mt-8 mb-2 space-y-8'>
                    <div className='relative w-full h-12'>
                        <input 
                            type="email" 
                            name="email" 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email} 
                            placeholder="Email" 
                            autoComplete="off" 
                            required
                            className='pl-3 w-full h-full bg-transparent border-none outline-none text-black text-[16px] placeholder:text-slate-400 rounded-xl'
                        />
                        <i className='text-[#DEDAD7] absolute transform -translate-y-1/2 right-5 top-1/2'><Mail /></i>
                    </div>

                    <button className="w-full h-12 bg-[#DEDAD7] border-none outline-none rounded-full shadow-lg cursor-pointer text-gray-600 font-semibold mt-4" 
                    type="submit">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
  )
}

export default ForgotPassPage
