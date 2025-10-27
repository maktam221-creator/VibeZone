import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { LocalizationProvider } from './context/LocalizationContext.js';
import { AuthProvider } from './context/AuthContext.js';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  React.createElement(React.StrictMode, null,
    React.createElement(LocalizationProvider, null,
      React.createElement(AuthProvider, null,
        React.createElement(App, null)
      )
    )
  )
);
