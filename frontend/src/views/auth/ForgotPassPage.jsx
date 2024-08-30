import { Mail } from 'lucide-react';
import React, { useState } from 'react';
import instance from '../../utils/axios';

const ForgotPassPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await instance.get(`user/password-reset-email/${email}/`);
            console.log(response);
            setMessage('A password reset link has been sent to your email.');
            setError(null);
        } catch (error) {
            console.error(error);
            setError('An error occurred while sending the reset email.');
            setMessage(null);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black pt-24">
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
                            className='pl-3 w-full h-full bg-transparent border-none outline-none text-black dark:text-white text-[16px] placeholder:text-slate-400 rounded-xl'
                        />
                        <i className='text-[#DEDAD7] absolute transform -translate-y-1/2 right-5 top-1/2'><Mail /></i>
                    </div>

                    <button className="w-full h-12 bg-[#DEDAD7] border-none outline-none rounded-full shadow-lg cursor-pointer text-gray-600 font-semibold mt-4" 
                    type="submit">
                        Reset Password
                    </button>
                </form>

                {message && <p className="text-green-500 text-center mt-4">{message}</p>}
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default ForgotPassPage;
