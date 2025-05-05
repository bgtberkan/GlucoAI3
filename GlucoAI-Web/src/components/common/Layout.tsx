import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">GlucoAI</h1>
            </div>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden flex items-center p-2"
              onClick={toggleMenu}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/dashboard" 
                className={`hover:text-blue-100 transition-colors ${
                  location.pathname === '/dashboard' ? 'font-bold' : ''
                }`}
              >
                Ana Sayfa
              </Link>
              <Link 
                to="/dashboard/statistics" 
                className={`hover:text-blue-100 transition-colors ${
                  location.pathname === '/dashboard/statistics' ? 'font-bold' : ''
                }`}
              >
                İstatistikler
              </Link>
              <Link 
                to="/dashboard/settings" 
                className={`hover:text-blue-100 transition-colors ${
                  location.pathname === '/dashboard/settings' ? 'font-bold' : ''
                }`}
              >
                Ayarlar
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-primary rounded hover:bg-blue-100 transition-colors"
              >
                Çıkış Yap
              </button>
            </nav>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/dashboard" 
              className={`block px-3 py-2 rounded-md ${
                location.pathname === '/dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-white hover:bg-blue-600 hover:text-white'
              }`}
            >
              Ana Sayfa
            </Link>
            <Link 
              to="/dashboard/statistics" 
              className={`block px-3 py-2 rounded-md ${
                location.pathname === '/dashboard/statistics' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-white hover:bg-blue-600 hover:text-white'
              }`}
            >
              İstatistikler
            </Link>
            <Link 
              to="/dashboard/settings" 
              className={`block px-3 py-2 rounded-md ${
                location.pathname === '/dashboard/settings' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-white hover:bg-blue-600 hover:text-white'
              }`}
            >
              Ayarlar
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left block px-3 py-2 rounded-md text-white hover:bg-blue-600"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 border-t mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} GlucoAI - Tüm Hakları Saklıdır
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 