import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import TempleCard from '../components/TempleCard';

const stats = [
  { number: '20+', label: 'Sacred Temples' },
  { number: '10+', label: 'States Covered' },
  { number: '13', label: 'Deities' },
  { number: '10+', label: 'Festivals Listed' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/temples/featured')
      .then(res => setFeatured(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden text-white text-center py-28 px-6"
        style={{ background: 'linear-gradient(160deg, #6B1A1A 0%, #B5390A 50%, #D4621A 100%)' }}>
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #FFD700, transparent)', transform: 'translate(-30%, -30%)' }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #FFD700, transparent)', transform: 'translate(30%, 30%)' }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="text-5xl mb-4">🛕</div>
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Discover India's<br />
            <span style={{ color: '#FFD580' }}>Sacred Temples</span>
          </h1>
          <p className="text-lg text-orange-100 mb-10 max-w-xl mx-auto leading-relaxed">
            Explore history, rituals, darshan timings, and pilgrimage routes across India's most revered temples.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/browse"
              className="bg-white font-semibold px-8 py-3 rounded-full hover:bg-orange-50 transition shadow-lg"
              style={{ color: '#7B1F1F' }}>
              Browse All Temples
            </Link>
            <Link to="/festivals"
              className="border-2 border-white/60 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition">
              Upcoming Festivals
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ background: '#7B1F1F' }} className="py-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center text-white">
              <div className="text-3xl font-bold" style={{ color: '#FFD580' }}>{s.number}</div>
              <div className="text-xs text-orange-200 uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Temples */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-1">Handpicked</p>
            <h2 className="text-3xl font-bold text-stone-800">Featured Temples</h2>
          </div>
          <Link to="/browse" className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1">
            View all <span>→</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-orange-50 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(temple => (
              <TempleCard key={temple.id} temple={temple} />
            ))}
          </div>
        )}
      </div>

      {/* Why use this portal */}
      <div style={{ background: '#FDF6EE' }} className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-2">Why use this portal</p>
          <h2 className="text-3xl font-bold text-stone-800 mb-12">Everything a pilgrim needs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🕐', title: 'Darshan Timings', desc: 'Accurate opening and closing times for every temple, including special day schedules.' },
              { icon: '🎉', title: 'Festival Calendar', desc: 'Stay updated on upcoming festivals, melas, and special puja events.' },
              { icon: '🗺️', title: 'Visitor Guidelines', desc: 'Dress codes, rules, nearby accommodation and transport options.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;