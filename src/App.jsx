// App.jsx - Replace your current imports
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./context/ThemeContext";
import LoadingSpinner from "./components/LoadingSpinner"; // Create this component

// Lazy load pages
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Home = lazy(() => import("./pages/Home"));
const ProtectedRoute = lazy(() => import("./pages/ProtectedRoute"));
const AdminProtectedRoute = lazy(() => import("./pages/AdminProtectedRoute"));

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
        
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            
            <Route
              path="/signup"
              element={
                <AdminProtectedRoute>
                  <Signup />
                </AdminProtectedRoute>
              }
            />
            
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}