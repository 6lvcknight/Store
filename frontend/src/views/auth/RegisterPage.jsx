import { Mail, RectangleEllipsis, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/auth';
import { register } from '../../utils/auth';

const RegisterPage = () => {
    const navigate = useNavigate()

    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [re_password, setRePassword] = useState('')

    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/')
        }
    }, [])

    const resetForm = () => {
        setEmail('');
        setPassword('');
    };

    const handleRegister = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const { error } = await register(email, username, fullname, phone, password, re_password)
        if (error) {
            alert(JSON.stringify(error))
        } else {
            navigate('/')
            resetForm()
        }
        setIsLoading(false)
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
            <div className='w-[420px] border-[2px] border-solid border-[#B4BFC5] text-white rounded-xl p-[30px] backdrop-opacity-30'>
                <h1 className='text-[#DEDAD7] text-[36px] text-center font-bold'>Register</h1>
                {/*isLoading && <Spinner />*/}
                <form className='mt-8 mb-2 space-y-8' onSubmit={handleRegister}>
                    <div className='relative w-full h-12'>
                        <input 
                            type="email" 
                            name="email" 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email} 
                            placeholder="Email" 
                            autoComplete="off" 
                            required
                            className='pl-3 w-full h-full bg-transparent border-none outline-none text-black dark:text-white text-[16px] placeholder:text-slate-400 rounded-xl'
                        />
                        <i className='text-[#DEDAD7] absolute transform -translate-y-1/2 right-5 top-1/2'><Mail /></i>
                    </div>
                    <div className='relative w-full h-12'>
                        <input 
                            type="text" 
                            name="username" 
                            onChange={(e) => setUsername(e.target.value)} 
                            value={username} 
                            placeholder="Username" 
                            autoComplete="off" 
                            required
                            className='pl-3 w-full h-full bg-transparent border-none outline-none text-black dark:text-white text-[16px] placeholder:text-slate-400 rounded-xl'
                        />
                        <i className='text-[#DEDAD7] absolute transform -translate-y-1/2 right-5 top-1/2'><Mail /></i>
                    </div>
                    <div className='relative w-full h-12'>
                        <input 
                            type="text" 
                            name="full name" 
                            onChange={(e) => setFullname(e.target.value)} 
                            value={fullname} 
                            placeholder="Full Name" 
                            required
                            className='pl-3 w-full h-full bg-transparent border-none outline-none text-black dark:text-white text-[16px] placeholder:text-slate-400 rounded-xl'
                        />
                        <i className='text-[#DEDAD7] absolute transform -translate-y-1/2 right-5 top-1/2'><User /></i>
                    </div>
                    <div className='relative w-full h-12'>
                        <input 
                            type="number" 
                            name="phone number" 
                            onChange={(e) => setPhone(e.target.value)} 
                            value={phone} 
                            placeholder="Phone Number" 
                            required
                            className='pl-3 w-full h-full bg-transparent border-none outline-none text-black dark:text-white text-[16px] placeholder:text-slate-400 rounded-xl'
                        />
                        <i className='text-[#DEDAD7] absolute transform -translate-y-1/2 right-5 top-1/2'><User /></i>
                    </div>
                    <div className='relative w-full h-12'>
                        <input 
                            type="password" 
                            name="password" 
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password} 
                            placeholder="Password" 
                            autoComplete="off" 
                            required
                            className='pl-3 w-full h-full bg-transparent border-none outline-none text-black dark:text-white text-[16px] placeholder:text-slate-400 rounded-xl'
                        />
                        <i className='text-[#DEDAD7] absolute transform -translate-y-1/2 right-5 top-1/2'><RectangleEllipsis /></i>
                    </div>
                    <div className='relative w-full h-12'>
                        <input 
                            type="password" 
                            name="re_password" 
                            onChange={(e) => setRePassword(e.target.value)} 
                            value={re_password} 
                            placeholder="Confirm Password" 
                            autoComplete="off" 
                            required
                            className='pl-3 w-full h-full bg-transparent border-none outline-none text-black dark:text-white text-[16px] placeholder:text-slate-400 rounded-xl'
                        />
                        <i className='text-[#DEDAD7] absolute transform -translate-y-1/2 right-5 top-1/2'><RectangleEllipsis /></i>
                    </div>
                    <button className="w-full h-12 bg-[#DEDAD7] border-none outline-none rounded-full shadow-lg cursor-pointer text-gray-600 font-semibold mt-4" 
                    type="submit">
                        Register
                    </button>

                    <div className="text-center text-[#DEDAD7] mt-6">
                        <p>Already Have Account? <NavLink to="/login" className="font-semibold">Sign In</NavLink></p>
                    </div>
                </form>
            </div>
        </div>
  )
}

export default RegisterPage
