import { useState, useEffect } from 'react';

export default function useAuthToken() {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    setIsLoggedIn(!!storedToken);
    setLoading(false);
  }, []);

  return { token, isLoggedIn, loading };
}