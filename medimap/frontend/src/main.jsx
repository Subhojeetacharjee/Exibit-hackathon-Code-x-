import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Apply saved theme before first paint to prevent flash
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.documentElement.classList.add('light-mode');
}

// Load Google Maps script dynamically from env variable (keeps key out of HTML)
const gKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
if (gKey) {
  const s = document.createElement('script');
  s.src = `https://maps.googleapis.com/maps/api/js?key=${gKey}&callback=Function.prototype`;
  s.async = true;
  s.defer = true;
  document.head.appendChild(s);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
