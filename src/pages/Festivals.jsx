import { useEffect, useState } from 'react';
import API from '../api/axios';

const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const Festivals = () => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/festivals')
      .then(res => setFestivals(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: 'linear-gradient(160deg, #FDF6EE 0%, #FFF8F0 100%)', minHeight: '100vh' }}>

      {/* Hero Banner */}
      <div className="relative overflow-hidden py-20 px-6 text-center"
        style={{ background: 'linear-gradient(160deg, #4A0E0E 0%, #8B2500 50%, #C45000 100%)' }}>

        {/* Floating emojis */}
        {['🎉','🪔','🌸','🔱','🎊','🪷','✨','🎆'].map((emoji, i) => (
          <span key={i} className="absolute select-none pointer-events-none"
            style={{
              fontSize: `${16 + (i % 3) * 6}px`,
              opacity: 0.2,
              left: `${5 + i * 12}%`,
              top: `${10 + (i % 3) * 25}%`,
              animation: `float-fest ${5 + i * 0.5}s ease-in-out ${i * 0.4}s infinite`,
            }}>{emoji}</span>
        ))}

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 tracking-widest uppercase"
            style={{ background: 'rgba(255,160,50,0.15)', border: '1px solid rgba(255,160,50,0.35)', color: '#FFD580' }}>
            ✦ Sacred Celebrations
          </div>
          <h1 className="text-4xl font-bold text-white mb-3"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
            Upcoming Festivals
          </h1>
          <p className="text-orange-200 text-base">
            Discover sacred celebrations across India's most revered temples
          </p>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #FDF6EE, transparent)' }} />
      </div>

      {/* Festival Grid */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1,2,3,4].map(i => (
              <div key={i} className="rounded-2xl h-36 animate-pulse"
                style={{ background: 'linear-gradient(135deg, #FDE8D0, #FBBF7A33)' }} />
            ))}
          </div>
        ) : festivals.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-stone-400 font-medium">No upcoming festivals found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {festivals.map((f, i) => {
              const hasDate = !!f.festival_date;
              const date = hasDate ? new Date(f.festival_date) : null;
              return (
                <div key={i}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ border: '1.5px solid rgba(255,160,50,0.15)' }}>

                  {/* Top color bar */}
                  <div className="h-1.5"
                    style={{ background: `linear-gradient(90deg, hsl(${(i * 47) % 360 < 60 ? 25 : (i * 47) % 360 < 120 ? 35 : 20}, 85%, 50%), hsl(${((i * 47) + 30) % 60 + 10}, 90%, 60%))` }} />

                  <div className="p-5 flex gap-4">
                    {/* Date box */}
                    {hasDate ? (
                      <div className="flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-center shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #7B1F1F, #B5390A)' }}>
                        <span className="text-white font-bold text-xl leading-none">{date.getDate()}</span>
                        <span className="text-orange-200 text-xs uppercase font-medium mt-0.5">{monthNames[date.getMonth()]}</span>
                        <span className="text-orange-300 text-xs">{date.getFullYear()}</span>
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-2xl"
                        style={{ background: 'linear-gradient(135deg, #FFF0E0, #FFE0C0)' }}>
                        🎉
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-stone-800 text-base leading-snug group-hover:text-orange-700 transition-colors">
                        {f.name}
                      </h3>
                      <p className="text-orange-600 text-sm font-medium mt-0.5">{f.temple_name}</p>
                      <p className="text-stone-400 text-xs mt-0.5 flex items-center gap-1">
                        <span>📍</span>{f.city}, {f.state}
                      </p>
                      {f.description && (
                        <p className="text-stone-500 text-sm mt-2 leading-relaxed line-clamp-2">{f.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes float-fest {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-18px) rotate(8deg); }
        }
      `}</style>
    </div>
  );
};

export default Festivals;