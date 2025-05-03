import React from 'react';
import ReactDOM from "react-dom/client";
import App from './app/App';  // Remove .js extension as TypeScript will resolve it
import './index.css';

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
