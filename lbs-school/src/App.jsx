import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import SearchModal from './components/SearchModal';
import BackToTop from './components/BackToTop';
import AnnouncementTicker, { NoticeBoard } from './components/AnnouncementTicker';
import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import Admissions from './pages/Admissions';
import Features from './pages/Features';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import ParentPortal from './pages/ParentPortal';
import StudentPortal from './pages/StudentPortal';
import AdmissionForm from './pages/AdmissionForm';

// Portal routes get NO navbar / ticker / bottomnav
const PORTAL_PATHS = ['/login', '/parent-portal', '/student-portal', '/admission-form'];

function AppShell() {
  const location = useLocation();
  const isPortal = PORTAL_PATHS.some(p => location.pathname.startsWith(p));

  const [searchOpen, setSearchOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('lbs-dark') === 'true');

  useEffect(() => {
    const root = document.documentElement;
    isDark ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('lbs-dark', isDark);
  }, [isDark]);

  useEffect(() => {
    const handler = e => {
      if (e.key === '/' && !searchOpen && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [searchOpen]);

  return (
    <>
      {/* Only show site chrome on non-portal pages */}
      {!isPortal && (
        <>
          <Navbar
            onSearch={() => setSearchOpen(true)}
            onToggleDark={() => setIsDark(d => !d)}
            isDark={isDark}
            onNotices={() => setNoticeOpen(true)}
          />
          <AnnouncementTicker onOpenNotices={() => setNoticeOpen(true)} />
        </>
      )}

      <main className={isPortal ? '' : 'page'}>
        <Routes>
          {/* Public site */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/features" element={<Features />} />
          <Route path="/gallery" element={<Gallery />} />

          {/* Auth + Portals */}
          <Route path="/login" element={<Login />} />
          <Route path="/parent-portal" element={<ParentPortal />} />
          <Route path="/student-portal" element={<StudentPortal />} />
          <Route path="/admission-form" element={<AdmissionForm />} />
        </Routes>
      </main>

      {!isPortal && (
        <>
          <BottomNav />
          <BackToTop />
        </>
      )}

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      {noticeOpen && <NoticeBoard onClose={() => setNoticeOpen(false)} />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
