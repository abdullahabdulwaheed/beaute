import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import StoreContextProvider from './context/StoreContext.jsx'

axios.defaults.withCredentials = true;
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StoreContextProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "no-id"}>
        <App />
      </GoogleOAuthProvider>
    </StoreContextProvider>
  </BrowserRouter>,
)
