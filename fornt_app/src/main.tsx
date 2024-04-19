import React from 'react'
import ReactDOM from 'react-dom/client'
//import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './routes/Login.tsx';
import Signup from './routes/signup.tsx';
import Dashboard from './routes/Dashboard.tsx';
import Protected from './routes/Protected.tsx';
import Home from './routes/Home.tsx';
import { AuthProvider } from './auth/AuthProvider.tsx';

const router = createBrowserRouter([
  

  { path: "/", 
  element: <Home />,
 },
  { path: "/login", 
  element: <Login />,
 },
 {
  path: "/signup",
  element: <Signup />,
 },
 {
  path: "/",
  element: <Protected />,
  children: [
    { path: "/dashboard", element: <Dashboard /> },
  ],
 }

 


]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </React.StrictMode>,
)
