import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import axios from 'axios'

// Automatically seed mock credentials for development to avoid logging in
if (!localStorage.getItem("email")) {
  localStorage.setItem("email", "shounak@example.com");
  localStorage.setItem("user_id", "1");
  localStorage.setItem("username", "Shounak");
  localStorage.setItem("token", "mock_token");
}

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="430843247170-ncncirn1ogiaqclq7402hq4ko21tiu94.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)