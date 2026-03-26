import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppLayout from './components/layout/AppLayout'
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import BranchPage from './pages/branch/BranchPage'
import ProductPage from './pages/product/ProductPage'
import TemplatePage from './pages/template/TemplatePage'
import PlanogramPage from './pages/planogram/PlanogramPage'
import UnauthorizedPage from './pages/UnauthorizedPage'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/branch" replace />} />
            <Route path="/branch" element={<BranchPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/template" element={<TemplatePage />} />
            <Route path="/planogram" element={<PlanogramPage />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
