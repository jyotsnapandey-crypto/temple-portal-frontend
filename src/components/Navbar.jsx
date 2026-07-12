import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/browse', label: 'Browse Temples' },
    { to: '/festivals', label: 'Festivals' },
    { to: '/planner', label: '🗺️ AI Planner' },
  ];

  return (
    <nav className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(60,10,0,0.97)'
          : 'linear-gradient(135deg, #4A0E0E 0%, #7B1F1F 60%, #B5390A 100%)',
        backdropFilter: 'blur(12px)',
        boxShadow: scrolled ? '0 2px 30px rgba(0,0,0,0.4)' : 'none',
        borderBottom: '1px solid rgba(255,160,50,0.15)',
      }}>

      {/* Golden top line */}
      <div className="h-0.5 w-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,200,80,0.8), rgba(255,140,0,0.6), rgba(255,200,80,0.8), transparent)' }} />

      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <span className="text-3xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300 inline-block">🛕</span>
            <div className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'radial-gradient(circle, rgba(255,160,50,0.3), transparent)' }} />
          </div>
          <div>
            <div className="font-bold text-white text-lg leading-tight tracking-wide"
              style={{ textShadow: '0 1px 8px rgba(255,100,0,0.4)' }}>
              Temple Heritage
            </div>
            <div className="text-orange-300 text-xs tracking-widest uppercase font-medium">
              India's Sacred Portals
            </div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to}
                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group"
                style={{ color: isActive ? '#FFD580' : 'rgba(255,255,255,0.85)' }}>
                {/* Hover background */}
                <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: 'rgba(255,160,50,0.12)' }} />
                <span className="relative">{link.label}</span>
                {/* Active underline */}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                    style={{ background: 'linear-gradient(90deg, transparent, #FFD580, transparent)' }} />
                )}
              </Link>
            );
          })}

          {/* CTA Button */}
          <Link to="/browse"
            className="ml-3 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(255,160,50,0.2), rgba(255,100,0,0.2))',
              border: '1px solid rgba(255,160,50,0.4)',
              color: '#FFD580',
              boxShadow: '0 0 15px rgba(255,120,0,0.2)',
            }}>
            ✦ Explore
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="w-5 h-0.5 bg-white mb-1 transition-all" style={{ transform: menuOpen ? 'rotate(45deg) translate(3px,3px)' : 'none' }} />
          <div className="w-5 h-0.5 bg-white mb-1 transition-all" style={{ opacity: menuOpen ? 0 : 1 }} />
          <div className="w-5 h-0.5 bg-white transition-all" style={{ transform: menuOpen ? 'rotate(-45deg) translate(3px,-3px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-1"
          style={{ borderTop: '1px solid rgba(255,160,50,0.15)' }}>
          {links.map(link => (
            <Link key={link.to} to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                color: location.pathname === link.to ? '#FFD580' : 'rgba(255,255,255,0.85)',
                background: location.pathname === link.to ? 'rgba(255,160,50,0.12)' : 'transparent'
              }}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;