import React, { useEffect, useState } from 'react'
import { Mail, RectangleEllipsis, User } from 'lucide-react'
import { login } from '../../utils/auth';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/');
        }
    }, []);

    const resetForm = () => {
        setEmail('');
        setPassword('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await login(email, password);
        if (error) {
            alert(error);
            setIsLoading(false);
        } else {
            navigate('/');
            resetForm();
            setIsLoading(false);
        }
    };
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
    <div className='w-[420px] border-[2px] border-solid border-[#B4BFC5] text-white p-[30px] backdrop-opacity-30'>
        <h1 className='text-[#DEDAD7] text-[36px] text-center font-bold'>Login</h1>
        <form onSubmit={handleLogin} className='mt-8 mb-2 space-y-8'>
            <div className='relative w-full h-12'>
                <input 
                    type="email" 
                    name="email" 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email} 
                    placeholder="Email" 
                    autoComplete="off" 
                    required
                    className='pl-3 w-full h-full bg-transparent border-none outline-none text-black dark:text-white text-[16px] placeholder:text-slate-400'
                />
                <i className='text-[#DEDAD7] absolute transform -translate-y-1/2 right-5 top-1/2'><Mail /></i>
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

            <div className="flex justify-between items-center text-[#DEDAD7] text-sm mb-6">
                <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                        Remember me
                </label>
                <NavLink to="/password-reset" className="hover:underline">Forgot password?</NavLink>
            </div>

            <button className="w-full h-12 bg-[#DEDAD7] border-none outline-none shadow-lg cursor-pointer text-gray-600 font-semibold mt-4" 
            type="submit">
                Login
            </button>

            <div className="text-center text-[#DEDAD7] mt-6">
                <p>Don't have an account? <NavLink to="/register" className="font-semibold">Sign Up</NavLink></p>
            </div>
        </form>
    </div>
</div>
  )
}

export default LoginPage
