import React, { useEffect, useState } from "react";


function GetCurrentAddress() {
    const [add, setAdd] = useState("");
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
                    fetch(url)
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then((data) => {
                            setAdd(data.address);
                        })
                        .catch((error) => {
                            setError(error.message);
                            console.error('There was a problem with the fetch operation:', error);
                        });
                },
                (err) => {
                    setError("Geolocation permission denied or unavailable.");
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    }, []);
    return add;
}

export default GetCurrentAddress