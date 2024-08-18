import React, { useEffect } from 'react'
import { logout } from '../../utils/auth'
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate('/')
    }, [])
  return (
    <div>
      
    </div>
  )
}

export default LogoutPage
