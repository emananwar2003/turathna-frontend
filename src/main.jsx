
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes } from "react-router"
import { ThemeProvider } from "@material-tailwind/react";
import { AuthProvider } from './context/Authcontext.jsx';
import { CartProvider } from './context/Cartcontext .jsx';
createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </CartProvider>
  </AuthProvider>,
);
