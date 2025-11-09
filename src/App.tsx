import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Gallery from './pages/Gallery'
import Videos from './pages/Videos'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import Testimonials from './pages/Testimonials'
import Contact from './pages/Contact'
import AdminDashboard from './pages/AdminDashboard'
import AdminContentEditor from './pages/AdminContentEditor'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-bgSoft text-primary">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/content/:section" element={<AdminContentEditor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
