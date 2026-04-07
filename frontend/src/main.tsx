import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login.pages.tsx'
import Dashboard from './pages/Dashboard.pages.tsx'
import MidlewereSecurity from './security/Midlewere.security.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: <MidlewereSecurity>
      <Dashboard />
    </MidlewereSecurity>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={Router} />
  </StrictMode>,
)
