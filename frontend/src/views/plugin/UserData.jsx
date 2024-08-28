import Cookie from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

function UserData() {
    let accessToken = Cookie.get('access_token');
    let refreshToken = Cookie.get('refresh_token');

    if (accessToken && refreshToken) {
        const token = refreshToken;
        const decoded = jwtDecode(token);
        return decoded;
    } else {
        return null;
    }
}

export default UserData;