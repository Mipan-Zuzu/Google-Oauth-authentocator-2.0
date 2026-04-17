import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login.pages'
import Dashboard from './pages/Dashboard.pages'
import Test from './pages/Test'
import MidlewereSecurity from './security/Midlewere.security'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Error from './pages/error.pages'

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <Error />
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
