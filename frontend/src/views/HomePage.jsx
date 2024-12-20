import React, { useEffect, useState } from 'react'
import APIinstance from '../utils/axios';
import UserData from './plugin/UserData';

const HomePage = () => {
  const [screen, setScreen] = useState([])

  useEffect(() => {
    APIinstance.get('vendor/screen/')
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setScreen(res.data);
        } else {
          console.error('Unexpected API response:', res.data);
        }
      })
      .catch(err => {
        console.error('API call failed:', err);
      });
  }, []);

  useEffect(() => {
    const video = document.querySelector('video');
    if (video) {
      video.addEventListener('contextmenu', (event) => {
        event.preventDefault();
      });
    }
    return () => {
      if (video) {
        video.removeEventListener('contextmenu', (event) => {
          event.preventDefault();
        });
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      {screen.map((screenItem) => (
        <div key={screenItem.id}>
          <video 
            src={screenItem.video}
            autoPlay 
            loop 
            muted
            className="absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      ))}
    </div>
  )
}

export default HomePage
