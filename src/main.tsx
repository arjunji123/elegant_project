import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ProductProvider } from "./context/ProductContext";


createRoot(document.getElementById('root')!).render(
<React.StrictMode>
<BrowserRouter>
<ProductProvider>
<App />
</ProductProvider>

</BrowserRouter>
</React.StrictMode>
)