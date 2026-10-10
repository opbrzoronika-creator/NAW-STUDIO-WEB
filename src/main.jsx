import React from 'react';
import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import Root from './Root.jsx';
createRoot(document.getElementById('root')).render(<Root />);

if ('serviceWorker' in navigator && import.meta.env.PROD && !Capacitor.isNativePlatform()) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
