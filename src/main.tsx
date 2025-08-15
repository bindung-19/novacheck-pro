import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Report from './pages/Report'
import './styles.css'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/report', element: <Report /> }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
