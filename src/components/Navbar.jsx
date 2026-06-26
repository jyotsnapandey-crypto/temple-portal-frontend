import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav style={{ background: 'linear-gradient(135deg, #7B1F1F 0%, #B5390A 100%)' }}
      className="text-white px-8 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-3 group">
        <span className="text-3xl">🛕</span>
        <div>
          <div className="text-xl font-bold tracking-wide leading-tight">Temple Heritage</div>
          <div className="text-xs text-orange-200 tracking-widest uppercase">India's Sacred Portals</div>
        </div>
      </Link>
      <div className="flex gap-8 text-sm font-medium">
        <Link to="/"
          className={`hover:text-orange-200 transition pb-1 ${location.pathname === '/' ? 'border-b-2 border-orange-300' : ''}`}>
          Home
        </Link>
        <Link to="/browse"
          className={`hover:text-orange-200 transition pb-1 ${location.pathname === '/browse' ? 'border-b-2 border-orange-300' : ''}`}>
          Browse Temples
        </Link>
        <Link to="/festivals"
          className={`hover:text-orange-200 transition pb-1 ${location.pathname === '/festivals' ? 'border-b-2 border-orange-300' : ''}`}>
          Festivals
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;