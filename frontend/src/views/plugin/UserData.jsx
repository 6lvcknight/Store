import Cookies from 'universal-cookie'
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const cookies = new Cookies();

function UserData() {
    let accessToken = cookies.get('access_token');
    let refreshToken = cookies.get('refresh_token');

    if (accessToken && refreshToken) {
        const token = refreshToken;
        const decoded = jwtDecode(token);
        return decoded;
    } else {
        return null;
    }
}

export default UserData;