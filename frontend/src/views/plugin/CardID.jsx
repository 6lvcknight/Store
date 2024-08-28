import React from 'react'

function CardID() {
    const generateRandomString = () => {
        const length = 30;
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i =0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            result += chars[randomIndex];
        }
        localStorage.setItem('randomString', result);
    }

    const existingRandomString = localStorage.getItem('randomString');
    if (!existingRandomString) {
        generateRandomString();
    } else {
        // log existing random string
    }
  return existingRandomString;
}

export default CardID
