import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ScrollToTop from 'react-scroll-to-top'
import Header from './components/Header'
import Footer from './components/Footer'
import Spinner from './components/Spinner'

const Home = lazy(() => import('./pages/Home'))
const AboutUs = lazy(() => import('./pages/AboutUs'))
const Services = lazy(() => import('./pages/Services'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Videos = lazy(() => import('./pages/Videos'))
const Blogs = lazy(() => import('./pages/Blogs'))
const BlogDetail = lazy(() => import('./pages/BlogDetail'))
const Testimonials = lazy(() => import('./pages/Testimonials'))
const Contact = lazy(() => import('./pages/Contact'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminRoutes = lazy(() => import('./pages/admin/AdminRoutes'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-nav">
        Skip to content
      </a>
      <div className="flex min-h-screen flex-col bg-bgSoft text-primary">
        <Header />
        <main id="main-content" className="flex-1">
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:slug" element={<BlogDetail />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<AdminLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
      <ScrollToTop smooth color="#731B1B" style={{ borderRadius: '50%' }} top={200} aria-label="Scroll to top" />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { borderRadius: '9999px', paddingInline: '1.5rem', paddingBlock: '0.75rem', fontSize: '0.9rem' },
        }}
      />
    </BrowserRouter>
  )
}

export default App
