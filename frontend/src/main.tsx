import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login.pages'
import Dashboard from './pages/Dashboard.pages'
import Test from './pages/Test'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Error from './pages/error.pages'
import MidlewereLogin from './security/MidlewereLoginPages.security'

const Router = createBrowserRouter([
  {
    path: "/",
    element: <MidlewereLogin>
      l<Login/>
    </MidlewereLogin>,
    errorElement: <Error />
  },
  {
    path: "/dashboard/user/:id",
    element: <MidlewereLogin>
      <Dashboard />
    </MidlewereLogin>
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
