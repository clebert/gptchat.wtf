import {App} from './components/app.js';
import * as React from 'react';
import {createRoot} from 'react-dom/client';
import 'tailwindcss/tailwind.css';

createRoot(document.querySelector(`main#app`)!).render(<App />);
