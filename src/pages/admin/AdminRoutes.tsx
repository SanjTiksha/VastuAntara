import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Spinner from '../../components/Spinner'

const AdminDashboard = lazy(() => import('../AdminDashboard'))
const AdminContentEditor = lazy(() => import('../AdminContentEditor'))
const AboutUsAdmin = lazy(() => import('./AboutUsAdmin'))
const SocialMediaLinks = lazy(() => import('./SocialMediaLinks'))

export default function AdminRoutes() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="about-us" element={<AboutUsAdmin />} />
        <Route path="content/:section" element={<AdminContentEditor />} />
        <Route path="social-media" element={<SocialMediaLinks />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </Suspense>
  )
}
