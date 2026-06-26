import { useEffect, useState } from 'react';
import API from '../api/axios';

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
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-1">Calendar</p>
        <h1 className="text-3xl font-bold text-stone-800">Upcoming Festivals</h1>
        <p className="text-stone-500 mt-2">Sacred celebrations across India's temples</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-orange-50 rounded-2xl h-32 animate-pulse" />
          ))}
        </div>
      ) : festivals.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <div className="text-5xl mb-4">🎉</div>
          <p>No upcoming festivals found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {festivals.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5 hover:shadow-md transition">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-stone-800 text-lg">{f.name}</h3>
                  <p className="text-orange-600 text-sm font-medium mt-1">{f.temple_name}</p>
                  <p className="text-stone-400 text-sm mt-0.5">📍 {f.city}, {f.state}</p>
                  {f.description && (
                    <p className="text-stone-600 text-sm mt-3 leading-relaxed">{f.description}</p>
                  )}
                </div>
                {f.festival_date && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-center min-w-16 flex-shrink-0">
                    <div className="text-orange-700 font-bold text-lg leading-none">
                      {new Date(f.festival_date).getDate()}
                    </div>
                    <div className="text-orange-500 text-xs mt-1 uppercase tracking-wide">
                      {new Date(f.festival_date).toLocaleString('default', { month: 'short' })}
                    </div>
                    <div className="text-orange-400 text-xs">
                      {new Date(f.festival_date).getFullYear()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Festivals;