import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ background: '#3D0D0D' }} className="text-orange-100 pt-12 pb-6 mt-0">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🛕</span>
            <span className="font-bold text-white text-lg">Temple Heritage</span>
          </div>
          <p className="text-sm text-orange-300 leading-relaxed">
            A centralized portal for India's sacred temple heritage — preserving history, guiding pilgrims.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Explore</h4>
          <div className="space-y-2 text-sm text-orange-300">
            <div><Link to="/" className="hover:text-white transition">Home</Link></div>
            <div><Link to="/browse" className="hover:text-white transition">Browse Temples</Link></div>
            <div><Link to="/festivals" className="hover:text-white transition">Festivals</Link></div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">About</h4>
          <p className="text-sm text-orange-300 leading-relaxed">
            Built to support pilgrims, tourists, and researchers with reliable, well-organized temple information across India.
          </p>
        </div>
      </div>
      <div className="border-t border-orange-900 pt-6 text-center text-xs text-orange-400">
        © 2026 Temple Heritage Portal — Preserving India's Sacred Legacy
      </div>
    </footer>
  );
};

export default Footer;