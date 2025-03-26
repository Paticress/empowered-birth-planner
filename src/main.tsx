
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/base.css';
import './styles/buttons.css';
import './styles/layout.css';
import './styles/media.css';
import './styles/typography.css';
import './styles/print.css';
import './styles/embed.css'; // Importando os novos estilos para incorporação

import './registerSW.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
