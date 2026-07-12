import { useState } from 'react';
import API from '../api/axios';

const PilgrimagePlanner = () => {
  const [form, setForm] = useState({
    startingCity: '',
    days: '3',
    deity: '',
    travelStyle: 'both',
    budget: 'moderate',
  });
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);

const showToast = (msg) => {
  setToast(msg);
  setTimeout(() => setToast(false), 4000);
};

  const deities = ['Any', 'Lord Shiva', 'Lord Vishnu', 'Lord Krishna', 'Goddess Durga', 'Lord Hanuman', 'Lord Ganesha', 'Goddess Kali', 'Lord Ram', 'Lord Venkateshwara'];

  const generateItinerary = async () => {
    if (!form.startingCity) return alert('Please enter your starting city!');
    setLoading(true);
    setItinerary(null);

    const prompt = `Create a detailed ${form.days}-day Hindu temple pilgrimage itinerary for someone starting from ${form.startingCity}, India.
${form.deity && form.deity !== 'Any' ? `They prefer temples dedicated to ${form.deity}.` : ''}
Travel style: ${form.travelStyle === 'spiritual' ? 'Focused on spiritual experience and rituals' : form.travelStyle === 'sightseeing' ? 'Mix of temples and tourist attractions' : 'Balance of spiritual and sightseeing'}.
Budget: ${form.budget}.

Format the response as a proper day-by-day itinerary with:
- Day number and title
- Morning, Afternoon, Evening activities
- Specific temple names with brief significance
- Travel tips and practical info
- Best time for darshan
- Estimated travel distances

Make it detailed, practical, and spiritually enriching. Include famous and lesser-known temples.`;

    try {
      const res = await API.post('/chat', {
        messages: [{ role: 'user', content: prompt }]
      });
      setItinerary(res.data.reply);
showToast('🛕 Your pilgrimage plan is ready!');
    } catch (err) {
      alert('Error generating itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatItinerary = (text) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.match(/^##?\s*Day\s*\d/i) || line.match(/^\*\*Day\s*\d/i)) {
        return <h3 key={i} className="text-lg font-bold mt-6 mb-2 flex items-center gap-2" style={{ color: '#7B1F1F' }}>
          <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7B1F1F, #B5390A)' }}>
            {line.match(/\d+/)?.[0]}
          </span>
          {line.replace(/^##?\s*|\*\*/g, '').replace(/Day\s*\d+:?\s*/i, '')}
        </h3>;
      }
      if (line.match(/^\*\*(Morning|Afternoon|Evening|Night)/i) || line.match(/^###\s*(Morning|Afternoon|Evening)/i)) {
        const timeEmoji = line.includes('Morning') ? '🌅' : line.includes('Afternoon') ? '☀️' : line.includes('Evening') ? '🌆' : '🌙';
        return <p key={i} className="font-semibold text-orange-700 mt-3 mb-1 flex items-center gap-1">
          <span>{timeEmoji}</span>
          <span>{line.replace(/^##?\s*|\*\*/g, '')}</span>
        </p>;
      }
      if (line.match(/^[-•*]\s/)) {
        return <p key={i} className="text-stone-600 text-sm ml-4 mb-1 flex gap-2">
          <span className="text-orange-400 flex-shrink-0">•</span>
          <span>{line.replace(/^[-•*]\s/, '')}</span>
        </p>;
      }
      if (line.match(/^\*\*[^*]+\*\*/) || line.match(/^###/)) {
        return <p key={i} className="font-semibold text-stone-800 mt-2 mb-1">
          {line.replace(/^##?\s*|\*\*/g, '')}
        </p>;
      }
      if (line.trim() === '') return <div key={i} className="h-1" />;
      return <p key={i} className="text-stone-600 text-sm mb-1 leading-relaxed">{line.replace(/\*\*/g, '')}</p>;
    });
  };

  return (
    <div style={{ background: 'linear-gradient(160deg, #FDF6EE 0%, #FFF8F0 100%)', minHeight: '100vh' }}>

      {/* Hero */}
      <div className="relative overflow-hidden py-16 px-6 text-center"
        style={{ background: 'linear-gradient(160deg, #4A0E0E 0%, #8B2500 50%, #C45000 100%)' }}>
        {['🛕','🪔','🌸','🔱','🗺️','✨'].map((emoji, i) => (
          <span key={i} className="absolute select-none pointer-events-none"
            style={{ fontSize: `${16 + i * 4}px`, opacity: 0.18, left: `${8 + i * 15}%`, top: `${15 + (i % 3) * 25}%`,
              animation: `float-p ${5 + i}s ease-in-out ${i * 0.5}s infinite` }}>{emoji}</span>
        ))}
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 tracking-widest uppercase"
            style={{ background: 'rgba(255,160,50,0.15)', border: '1px solid rgba(255,160,50,0.35)', color: '#FFD580' }}>
            ✦ AI Powered
          </div>
          <h1 className="text-4xl font-bold text-white mb-3" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
            Pilgrimage Planner
          </h1>
          <p className="text-orange-200 text-base">
            Let AI create your perfect spiritual journey across India's sacred temples
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8"
          style={{ background: 'linear-gradient(to top, #FDF6EE, transparent)' }} />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 mb-8">
          <h2 className="text-lg font-bold text-stone-800 mb-5 flex items-center gap-2">
            <span>🗺️</span> Plan Your Pilgrimage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-stone-600 block mb-1">Starting City *</label>
              <input value={form.startingCity}
                onChange={e => setForm(f => ({ ...f, startingCity: e.target.value }))}
                className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="e.g. Mumbai, Delhi, Chennai..." />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-600 block mb-1">Number of Days</label>
              <select value={form.days} onChange={e => setForm(f => ({ ...f, days: e.target.value }))}
                className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                {['1','2','3','4','5','7','10','14'].map(d => (
                  <option key={d} value={d}>{d} {d === '1' ? 'Day' : 'Days'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-stone-600 block mb-1">Preferred Deity</label>
              <select value={form.deity} onChange={e => setForm(f => ({ ...f, deity: e.target.value }))}
                className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                {deities.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-stone-600 block mb-1">Travel Style</label>
              <select value={form.travelStyle} onChange={e => setForm(f => ({ ...f, travelStyle: e.target.value }))}
                className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="spiritual">🙏 Pure Spiritual</option>
                <option value="both">⚖️ Spiritual + Sightseeing</option>
                <option value="sightseeing">🏛️ Cultural & Sightseeing</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-stone-600 block mb-1">Budget</label>
              <select value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="budget">💰 Budget Friendly</option>
                <option value="moderate">💳 Moderate</option>
                <option value="luxury">✨ Luxury</option>
              </select>
            </div>
          </div>

          <button onClick={generateItinerary} disabled={loading}
            className="mt-5 w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-300 hover:scale-[1.01] disabled:opacity-60"
            style={{ background: loading ? '#999' : 'linear-gradient(135deg, #7B1F1F, #B5390A)', boxShadow: loading ? 'none' : '0 4px 15px rgba(180,50,0,0.3)' }}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating your pilgrimage plan...
              </span>
            ) : '✨ Generate My Pilgrimage Plan'}
          </button>
        </div>

        {/* Result */}
        {itinerary && (
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                <span>🛕</span> Your Pilgrimage Itinerary
              </h2>
              <div className="flex gap-2 text-xs">
                <span className="px-3 py-1 rounded-full font-medium"
                  style={{ background: '#FFF0E0', color: '#B5390A' }}>
                  📍 {form.startingCity}
                </span>
                <span className="px-3 py-1 rounded-full font-medium"
                  style={{ background: '#FFF0E0', color: '#B5390A' }}>
                  📅 {form.days} Days
                </span>
              </div>
            </div>
            <div className="prose max-w-none">
              {formatItinerary(itinerary)}
            </div>
            <div className="mt-6 pt-4 border-t border-orange-100 flex gap-3">
              <button onClick={generateItinerary}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{ background: '#FFF0E0', color: '#B5390A' }}>
                🔄 Regenerate
              </button>
              <button onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #7B1F1F, #B5390A)', color: 'white' }}>
                🖨️ Print Plan
              </button>
            </div>
          </div>
        )}
      </div>
      {toast && (
  <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-xl flex items-center gap-2"
    style={{ background: 'linear-gradient(135deg, #7B1F1F, #B5390A)', animation: 'fade-in 0.3s ease' }}>
    {toast}
  </div>
)}

      <style>{`
        @keyframes float-p {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-15px) rotate(8deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(15px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease forwards; }
      `}</style>
    </div>
  );
};

export default PilgrimagePlanner;