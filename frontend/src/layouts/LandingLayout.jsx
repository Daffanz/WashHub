import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Droplets } from 'lucide-react';
import { NAV_LINKS } from '../utils/constants';

export default function LandingLayout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-navy-900/80 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                WashHub
              </span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-surface-200 hover:text-white transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
              <Link
                to="/login"
                className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-accent-500 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25"
              >
                Login
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="md:hidden text-white p-2">
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <div className="md:hidden bg-navy-800/95 backdrop-blur-xl border-t border-white/5 animate-fade-in">
            <div className="px-4 py-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-surface-200 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <Link
                to="/login"
                onClick={() => setIsMobileOpen(false)}
                className="block text-center px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer id="contact" className="bg-navy-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">WashHub</span>
              </div>
              <p className="text-surface-200 text-sm leading-relaxed">
                Smart Franchise Laundry Management System. Integrating operations, suppliers, and franchise monitoring in one platform.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Home', 'Features', 'About Us', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase().replace(' ', '')}`} className="text-surface-200 hover:text-primary-400 text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                {['Supplier Management', 'Inventory Tracking', 'Franchise Monitoring', 'KPI Dashboard'].map((service) => (
                  <li key={service}>
                    <span className="text-surface-200 text-sm">{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm text-surface-200">
                <li>📧 info@washhub.com</li>
                <li>📱 +62 812 3456 7890</li>
                <li>📍 Jakarta, Indonesia</li>
              </ul>
              <div className="flex gap-3 mt-4">
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                  <a key={social} href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-primary-500/20 flex items-center justify-center text-surface-200 hover:text-primary-400 transition-all text-xs font-bold">
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-surface-200 text-sm">© 2026 WashHub. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-surface-200 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-surface-200 hover:text-white text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
