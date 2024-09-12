import React, { useState } from 'react'
import { RectangleEllipsis } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import APIinstance from '../../utils/axios';


const ChangePassPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();
    // const [searchParam] = useSearchParams();
    const { otp, uidb64 } = useParams();

    // const otp = searchParam.get('otp');
    // const uidb64 = searchParam.get('uidb64');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        } else {
            const formdata = new FormData();
            formdata.append('password', password);
            formdata.append('otp', otp);
            formdata.append('uidb64', uidb64);

            try {
                const response = await APIinstance.post('user/password-reset/', formdata);
                console.log('Response:', response);

                alert('Password changed successfully');
                navigate('/login');
            } catch (error) {
                console.error('Password reset error:', error);
                alert('An error occurred');
            }
        }
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black pt-24">
        <div className='w-[420px] border-[2px] border-solid border-[#B4BFC5] text-white rounded-xl p-[30px] backdrop-opacity-30'>
        <h1 className='text-[#DEDAD7] text-[36px] text-center font-bold'>New Password</h1>
        <form onSubmit={handleSubmit} className='mt-8 mb-2 space-y-8'>
            <div className='relative w-full h-12'>
                <input 
                    type="password" 
                    name="new_password" 
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
                    name="re_new_password" 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    value={confirmPassword} 
                    placeholder="Confirm password" 
                    autoComplete="off" 
                    required
                    className='pl-3 w-full h-full bg-transparent border-none outline-none text-black dark:text-white text-[16px] placeholder:text-slate-400 rounded-xl'
                />
                <i className='text-[#DEDAD7] absolute transform -translate-y-1/2 right-5 top-1/2'><RectangleEllipsis /></i>
            </div>

            <button className="w-full h-12 bg-[#DEDAD7] border-none outline-none rounded-full shadow-lg cursor-pointer text-gray-600 font-semibold mt-4" 
            type="submit">
                Confirm
            </button>
        </form>
    </div>
</div>
  )
}

export default ChangePassPage
