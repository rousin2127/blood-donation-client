import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import { RouterProvider } from 'react-router'
import AuthProvider from './context/AuthContext/AuthProvider'
import { ThemeProvider } from './context/ThemeContext/ThemeProvider'
import AppToastContainer from './components/AppToastContainer'
import { router } from './routers/Route'




createRoot(document.getElementById('root')).render(
  <StrictMode>
   <ThemeProvider>
     <AuthProvider>
       <RouterProvider router={router} />
       <AppToastContainer />
     </AuthProvider>
   </ThemeProvider>
  </StrictMode>,
)
