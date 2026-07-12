import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import TempleCard from '../components/TempleCard';

const stats = [
  { number: '20+', label: 'Sacred Temples' },
  { number: '10+', label: 'States Covered' },
  { number: '13', label: 'Deities' },
  { number: '10+', label: 'Festivals Listed' },
];

// Floating particles data
const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  emoji: ['🛕', '🪔', '🌸', '🔱', '☸️', '🪷'][i % 6],
  size: Math.random() * 20 + 14,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: Math.random() * 6 + 6,
  delay: Math.random() * 4,
}));

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState([]);
  const cardsRef = useRef([]);

  useEffect(() => {
    API.get('/temples/featured')
      .then(res => setFeatured(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => [...prev, entry.target.dataset.index]);
          }
        });
      },
      { threshold: 0.15 }
    );
    cardsRef.current.forEach(ref => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, [featured]);

  return (
    <div>
      {/* ── HERO ── */}
      <div className="relative overflow-hidden text-white text-center py-28 px-6"
        style={{ background: 'linear-gradient(160deg, #4A0E0E 0%, #8B2500 40%, #C45000 100%)', minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

        {/* Animated radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,160,50,0.18) 0%, transparent 70%)',
          animation: 'pulse-glow 4s ease-in-out infinite'
        }} />

        {/* Floating particles */}
        {particles.map(p => (
          <span key={p.id} className="absolute select-none pointer-events-none"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              fontSize: `${p.size}px`,
              opacity: 0.18,
              animation: `float-up ${p.duration}s ease-in-out ${p.delay}s infinite`,
              filter: 'blur(0.3px)',
            }}>
            {p.emoji}
          </span>
        ))}

        {/* Decorative top arc */}
        <div className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,200,80,0.7), transparent)' }} />

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-widest uppercase"
            style={{ background: 'rgba(255,160,50,0.15)', border: '1px solid rgba(255,160,50,0.35)', color: '#FFD580' }}>
            ✦ India's Sacred Heritage Portal
          </div>

          <h1 className="font-bold leading-tight mb-5"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', textShadow: '0 2px 30px rgba(255,120,30,0.4)' }}>
            Discover India's<br />
            <span style={{
              background: 'linear-gradient(90deg, #FFD580, #FF9A3C, #FFD580)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% auto',
              animation: 'shimmer-text 3s linear infinite',
            }}>
              Sacred Temples
            </span>
          </h1>

          <p className="text-orange-100 mb-10 max-w-xl mx-auto leading-relaxed"
            style={{ fontSize: '1.05rem', textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}>
            Explore history, rituals, darshan timings, and pilgrimage routes across India's most revered temples.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/browse"
              className="relative font-semibold px-8 py-3 rounded-full transition-all duration-300 overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, #FF8C00, #FF5500)', boxShadow: '0 0 20px rgba(255,120,0,0.5), 0 4px 15px rgba(0,0,0,0.3)', color: 'white' }}>
              <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, #FF9A00, #FF6600)', boxShadow: '0 0 30px rgba(255,150,0,0.8)' }} />
              <span className="relative">Browse All Temples →</span>
            </Link>
            <Link to="/festivals"
              className="font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:bg-white/10"
              style={{ border: '1.5px solid rgba(255,200,80,0.5)', color: '#FFD580', backdropFilter: 'blur(8px)' }}>
              Upcoming Festivals
            </Link>
          </div>

          {/* Scroll hint */}
          <div className="mt-14 flex flex-col items-center gap-1 opacity-50">
            <span className="text-xs tracking-widest uppercase text-orange-200">Scroll to explore</span>
            <div style={{ width: 1.5, height: 36, background: 'linear-gradient(to bottom, rgba(255,200,80,0.8), transparent)', animation: 'scroll-line 1.5s ease-in-out infinite' }} />
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div style={{ background: 'linear-gradient(90deg, #3D0A0A, #6B1A1A, #3D0A0A)' }} className="py-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,160,50,0.07), transparent)' }} />
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center text-white group cursor-default">
              <div className="text-3xl font-bold transition-all duration-300 group-hover:scale-110"
                style={{ color: '#FFD580', textShadow: '0 0 20px rgba(255,200,80,0.5)' }}>{s.number}</div>
              <div className="text-xs text-orange-300 uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURED TEMPLES ── */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-1">✦ Handpicked</p>
            <h2 className="text-3xl font-bold text-stone-800">Featured Temples</h2>
          </div>
          <Link to="/browse" className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1 group">
            View all <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl h-80 animate-pulse"
                style={{ background: 'linear-gradient(135deg, #FDE8D0, #FBBF7A33)' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((temple, i) => (
              <div key={temple.id}
                data-index={i}
                ref={el => cardsRef.current[i] = el}
                style={{
                  opacity: visibleCards.includes(String(i)) ? 1 : 0,
                  transform: visibleCards.includes(String(i)) ? 'translateY(0)' : 'translateY(40px)',
                  transition: `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`
                }}>
                <TempleCard temple={temple} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── WHY USE THIS PORTAL ── */}
      <div style={{ background: 'linear-gradient(180deg, #FDF6EE 0%, #FFF8F0 100%)' }} className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-2">✦ Why use this portal</p>
          <h2 className="text-3xl font-bold text-stone-800 mb-12">Everything a pilgrim needs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🕐', title: 'Darshan Timings', desc: 'Accurate opening and closing times for every temple, including special day schedules.' },
              { icon: '🎉', title: 'Festival Calendar', desc: 'Stay updated on upcoming festivals, melas, and special puja events.' },
              { icon: '🗺️', title: 'Visitor Guidelines', desc: 'Dress codes, rules, nearby accommodation and transport options.' },
            ].map((item, i) => (
              <div key={i}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default"
                style={{ '--glow': 'rgba(255,140,0,0.15)' }}>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{item.icon}</div>
                <h3 className="font-bold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── INLINE KEYFRAMES ── */}
      <style>{`
        @keyframes float-up {
          0%   { transform: translateY(0px) rotate(0deg); opacity: 0.18; }
          50%  { transform: translateY(-22px) rotate(8deg); opacity: 0.28; }
          100% { transform: translateY(0px) rotate(0deg); opacity: 0.18; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.8; }
          50%       { opacity: 1; }
        }
        @keyframes shimmer-text {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes scroll-line {
          0%, 100% { opacity: 0.5; transform: scaleY(1); }
          50%       { opacity: 1;   transform: scaleY(1.3); }
        }
      `}</style>
    </div>
  );
};

export default Home;