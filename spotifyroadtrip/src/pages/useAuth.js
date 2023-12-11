import { useEffect, useState } from 'react';
import axios from 'axios';

const SPOTIFY_LOGIN_URL = 'http://localhost:8080/spotify/login';
const SPOTIFY_REFRESH_URL = 'http://localhost:8080/spotify/refresh';

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    async function fetchTokens() {
      try {
        const response = await axios.post(SPOTIFY_LOGIN_URL, { code });
        const { accessToken, refreshToken, expiresIn } = response.data;

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setExpiresIn(expiresIn);

        window.history.pushState({}, null, '/');
      } catch (error) {
        window.location = '/';
      }
    }

    if (code) {
      fetchTokens();
    }
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    const interval = setInterval(async () => {
      try {
        const response = await axios.post(SPOTIFY_REFRESH_URL, { refreshToken });
        const { accessToken, expiresIn } = response.data;

        setAccessToken(accessToken);
        setExpiresIn(expiresIn);
      } catch (error) {
        window.location = '/';
      }
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}