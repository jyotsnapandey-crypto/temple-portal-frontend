import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';

const TempleDetail = () => {
  const { id } = useParams();
  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('history');

  useEffect(() => {
    API.get(`/temples/${id}`)
      .then(res => setTemple(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #FDF6EE, #FFF8F0)' }}>
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🛕</div>
        <p className="text-orange-600 font-medium">Loading temple details...</p>
      </div>
    </div>
  );

  if (!temple) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Temple not found.</p>
    </div>
  );

  const tabs = [
    { id: 'history', label: '📜 History' },
    { id: 'timings', label: '🕐 Timings', show: temple.darshan_timings?.length > 0 },
    { id: 'festivals', label: '🎉 Festivals', show: temple.festivals?.length > 0 },
    { id: 'visitor', label: '📋 Visitor Info', show: !!temple.visitor_info },
  ].filter(t => t.show !== false);

  return (
    <div style={{ background: 'linear-gradient(160deg, #FDF6EE 0%, #FFF8F0 100%)', minHeight: '100vh' }}>

      {/* ── HERO BANNER ── */}
      <div className="relative overflow-hidden" style={{ height: '70vh', minHeight: 400 }}>

        {/* Background image */}
        {temple.image_url ? (
          <img src={temple.image_url} alt={temple.name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: 'scale(1.05)', filter: 'brightness(0.75)' }} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-8xl"
            style={{ background: 'linear-gradient(135deg, #7B1F1F, #B5390A)' }}>🛕</div>
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(30,5,0,0.92) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(80,10,0,0.4) 0%, transparent 60%)' }} />

        {/* Floating particles */}
        {['🪔','🌸','🪷','✨','🔱'].map((emoji, i) => (
          <span key={i} className="absolute select-none pointer-events-none"
            style={{
              fontSize: `${14 + i * 3}px`,
              opacity: 0.2,
              top: `${15 + i * 15}%`,
              right: `${5 + i * 8}%`,
              animation: `float-particle ${5 + i}s ease-in-out ${i * 0.8}s infinite`,
            }}>{emoji}</span>
        ))}

        {/* Back button */}
        <div className="absolute top-6 left-6 z-10">
          <Link to="/browse"
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/20"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
            ← Back to Browse
          </Link>
        </div>

        {/* Temple info overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-10 z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,160,50,0.25)', border: '1px solid rgba(255,160,50,0.5)', color: '#FFD580', backdropFilter: 'blur(8px)' }}>
                {temple.deity}
              </span>
              <span className="text-xs font-medium px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}>
                📍 {temple.city}, {temple.state}
              </span>
            </div>
            <h1 className="font-bold text-white leading-tight mb-2"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
              {temple.name}
            </h1>
            {temple.description && (
              <p className="text-orange-100 max-w-2xl leading-relaxed"
                style={{ fontSize: '0.95rem', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
                {temple.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="sticky top-0 z-20 shadow-sm"
        style={{ background: 'rgba(255,248,240,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,160,50,0.2)' }}>
        <div className="max-w-4xl mx-auto px-6 flex gap-1 overflow-x-auto py-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200"
              style={activeTab === tab.id ? {
                background: 'linear-gradient(135deg, #7B1F1F, #B5390A)',
                color: 'white',
                boxShadow: '0 2px 10px rgba(180,50,0,0.3)'
              } : {
                color: '#7B4030',
                background: 'transparent',
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2"
                style={{ color: '#7B1F1F' }}>
                <span>📜</span> History
              </h2>
              <p className="text-stone-600 leading-relaxed">{temple.history}</p>
            </div>

            {temple.deity_significance && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2"
                  style={{ color: '#7B1F1F' }}>
                  <span>🙏</span> About {temple.deity}
                </h2>
                <p className="text-stone-600 leading-relaxed">{temple.deity_significance}</p>
              </div>
            )}
          </div>
        )}

        {/* Timings Tab */}
        {activeTab === 'timings' && temple.darshan_timings?.length > 0 && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-orange-50"
                style={{ background: 'linear-gradient(135deg, #FFF5EC, #FFF8F0)' }}>
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#7B1F1F' }}>
                  <span>🕐</span> Darshan Timings
                </h2>
              </div>
              <div className="divide-y divide-orange-50">
                {temple.darshan_timings.map((t, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-orange-50/50 transition-colors">
                    <div>
                      <span className="font-semibold text-stone-800">{t.day_type}</span>
                      {t.notes && <p className="text-xs text-stone-400 mt-0.5">{t.notes}</p>}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="px-3 py-1 rounded-full font-medium"
                        style={{ background: '#FFF0E0', color: '#B5390A' }}>
                        {t.open_time}
                      </span>
                      <span className="text-stone-300">→</span>
                      <span className="px-3 py-1 rounded-full font-medium"
                        style={{ background: '#FFF0E0', color: '#B5390A' }}>
                        {t.close_time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Festivals Tab */}
        {activeTab === 'festivals' && temple.festivals?.length > 0 && (
          <div className="animate-fade-in grid grid-cols-1 sm:grid-cols-2 gap-4">
            {temple.festivals.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100 flex gap-4 hover:shadow-md transition-all hover:-translate-y-0.5">
                {f.festival_date && (
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center text-center"
                    style={{ background: 'linear-gradient(135deg, #7B1F1F, #B5390A)' }}>
                    <span className="text-white font-bold text-lg leading-none">
                      {new Date(f.festival_date).getDate()}
                    </span>
                    <span className="text-orange-200 text-xs uppercase">
                      {new Date(f.festival_date).toLocaleString('default', { month: 'short' })}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-stone-800">{f.name}</h3>
                  {f.festival_date && (
                    <p className="text-xs text-orange-500 mt-0.5">
                      {new Date(f.festival_date).getFullYear()}
                    </p>
                  )}
                  {f.description && <p className="text-sm text-stone-500 mt-1 leading-relaxed">{f.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Visitor Info Tab */}
        {activeTab === 'visitor' && temple.visitor_info && (
          <div className="animate-fade-in space-y-4">
            {[
              { icon: '🌐', label: 'Official Website', value: temple.visitor_info.official_website, isLink: true },
              { icon: '👗', label: 'Dress Code', value: temple.visitor_info.dress_code },
              { icon: '📜', label: 'Rules & Guidelines', value: temple.visitor_info.rules },
              { icon: '🏨', label: 'Nearby Accommodation', value: temple.visitor_info.nearby_accommodation },
              { icon: '🚗', label: 'Transport Options', value: temple.visitor_info.transport_options },
              { icon: '📍', label: 'Places to Visit Nearby', value: temple.visitor_info.places_to_visit },
            ].filter(item => item.value).map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100 flex gap-4 hover:shadow-md transition-all">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: 'linear-gradient(135deg, #FFF0E0, #FFE0C0)' }}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange-400 mb-1">{item.label}</p>
                  {item.isLink ? (
                    <a href={item.value} target="_blank" rel="noreferrer"
                      className="text-orange-600 hover:underline text-sm font-medium">{item.value}</a>
                  ) : (
                    <p className="text-stone-600 text-sm leading-relaxed">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-15px) rotate(10deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease forwards; }
      `}</style>
    </div>
  );
};

export default TempleDetail;