import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login.pages'
import Dashboard from './pages/Dashboard.pages'
import Test from './pages/test'
import MidlewereSecurity from './security/Midlewere.security'
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
  },
  {
    path: "/test",
    element: <Test />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={Router} />
  </StrictMode>,
)
