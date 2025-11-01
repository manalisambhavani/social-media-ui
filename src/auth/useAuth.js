import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';


export function useAuth() {
    const [user, setUser] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    setUser(decoded);
                } else {
                    localStorage.removeItem('token');
                }
            } catch {
                localStorage.removeItem('token');
            }
        }
    }, []);


    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login';
    };


    return { user, setUser, logout };
}